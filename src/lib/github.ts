/**
 * GitHub API utility for committing files to repository
 * Uses Personal Access Token (PAT) for authentication
 */

interface GitHubCommitResponse {
    content: {
        sha: string;
        path: string;
        html_url: string;
    };
    commit: {
        sha: string;
        html_url: string;
    };
}

/**
 * Commit a file to GitHub repository
 * @param path - File path in repo (e.g., "content/system-design/introduction.mdx")
 * @param content - File content (will be base64 encoded)
 * @param message - Commit message
 * @returns GitHub API response with commit details
 */
export async function commitFileToGitHub(
    path: string,
    content: string,
    message: string
): Promise<GitHubCommitResponse> {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "docs-submission";

    if (!token) {
        throw new Error("GITHUB_TOKEN environment variable is not set");
    }

    if (!repo) {
        throw new Error("GITHUB_REPO environment variable is not set");
    }

    // Base64 encode the content
    const encodedContent = Buffer.from(content, "utf-8").toString("base64");

    // GitHub API endpoint
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

    // Check if file exists first (to get SHA for updates)
    let existingFileSha: string | undefined;
    try {
        const checkResponse = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (checkResponse.ok) {
            const existingFile = await checkResponse.json();
            existingFileSha = existingFile.sha;
            console.log(`File exists, will update. SHA: ${existingFileSha}`);
        }
    } catch (error) {
        // File doesn't exist, will create new
        console.log("File doesn't exist, will create new file");
    }

    // Create or update file
    const requestBody: any = {
        message,
        content: encodedContent,
        branch,
    };

    // Include SHA if updating existing file
    if (existingFileSha) {
        requestBody.sha = existingFileSha;
    }

    const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`GitHub API error: ${error.message || response.statusText}`);
    }

    const result = await response.json();
    console.log(`Successfully committed file to GitHub: ${result.content.html_url}`);

    return result;
}

/**
 * Generate slug from title
 * e.g., "Introduction to System Design" -> "introduction-to-system-design"
 */
export function generateSlugFromTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
