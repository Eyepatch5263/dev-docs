import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface WelcomeEmailProps {
    userName: string;
    siteUrl?: string;
}

export function WelcomeEmail({
    userName,
    siteUrl = "https://explainbytes.tech",
}: WelcomeEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Welcome to ExplainBytes - Your engineering knowledge hub awaits!</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo */}
                    <Section style={logoContainer}>
                        <Img
                            src={`${siteUrl}/explain.png`}
                            alt="ExplainBytes"
                            width="180"
                            height="auto"
                            style={logo}
                        />
                    </Section>

                    {/* Welcome Banner */}
                    <Section style={gradientBanner}>
                        <Text style={welcomeEmoji}>🎉</Text>
                    </Section>

                    <Heading style={heading}>Welcome to ExplainBytes!</Heading>

                    <Text style={paragraph}>
                        Hi <strong>{userName}</strong>,
                    </Text>

                    <Text style={paragraph}>
                        Your email has been verified and your account is now active! You're now part of a growing community of developers and engineers learning together.
                    </Text>

                    <Hr style={hr} />

                    {/* Features Section */}
                    <Heading as="h2" style={subheading}>
                        Explore What's Waiting for You
                    </Heading>

                    {/* Feature 1: Flash Docs */}
                    <Section style={featureCard}>
                        <Text style={featureIcon}>📚</Text>
                        <Text style={featureTitle}>Flash Docs</Text>
                        <Text style={featureDescription}>
                            Deep explanations of OS, DBMS, Networking, and System Design. From fundamentals to expert-level concepts.
                        </Text>
                        <Button style={featureButton} href={`${siteUrl}/docs`}>
                            Read Concepts
                        </Button>
                    </Section>

                    {/* Feature 2: Flash Cards */}
                    <Section style={featureCard}>
                        <Text style={featureIcon}>🃏</Text>
                        <Text style={featureTitle}>Flash Cards</Text>
                        <Text style={featureDescription}>
                            Interactive flashcards to help you memorize essential engineering concepts through active recall.
                        </Text>
                        <Button style={featureButton} href={`${siteUrl}/flashcards`}>
                            Practice Now
                        </Button>
                    </Section>

                    {/* Feature 3: Engineering Terms */}
                    <Section style={featureCard}>
                        <Text style={featureIcon}>🔍</Text>
                        <Text style={featureTitle}>Engineering Terms</Text>
                        <Text style={featureDescription}>
                            Explore a curated collection of engineering terms, definitions, and related concepts with clear explanations.
                        </Text>
                        <Button style={featureButton} href={`${siteUrl}/engineering-terms`}>
                            Explore Terms
                        </Button>
                    </Section>

                    {/* Feature 4: Collaborative Editor */}
                    <Section style={featureCard}>
                        <Text style={featureIcon}>✍️</Text>
                        <Text style={featureTitle}>Collaborative Editor</Text>
                        <Text style={featureDescription}>
                            Seamlessly collaborate on documents in real-time, publish with a single click, and contribute to a growing ecosystem of shared knowledge.
                        </Text>
                        <Button style={featureButton} href={`${siteUrl}/collaborative-editor`}>
                            Try Now
                        </Button>
                    </Section>

                    <Hr style={hr} />

                    {/* CTA Section */}
                    <Section style={ctaSection}>
                        <Text style={ctaText}>
                            Ready to start your learning journey?
                        </Text>
                        <Button style={primaryButton} href={siteUrl}>
                            Explore ExplainBytes
                        </Button>
                    </Section>

                    <Hr style={hr} />

                    {/* Footer */}
                    <Text style={footer}>
                        Questions? Reach out to us anytime. We're here to help!
                    </Text>
                    <Text style={footer}>
                        © {new Date().getFullYear()} ExplainBytes. All rights reserved.
                    </Text>
                    <Text style={footerLinks}>
                        <Link href={siteUrl} style={link}>Website</Link>
                        {" • "}
                        <Link href={`${siteUrl}/docs`} style={link}>Docs</Link>
                        {" • "}
                        <Link href={`${siteUrl}/flashcards`} style={link}>Flashcards</Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: "#f4f4f5",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px 24px",
    marginTop: "40px",
    marginBottom: "40px",
    borderRadius: "16px",
    maxWidth: "520px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
};

const logoContainer = {
    textAlign: "center" as const,
    marginBottom: "24px",
};

const logo = {
    margin: "0 auto",
};

const gradientBanner = {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center" as const,
    marginBottom: "24px",
};

const welcomeEmoji = {
    fontSize: "48px",
    margin: "0",
    lineHeight: "1",
};

const heading = {
    fontSize: "28px",
    fontWeight: "bold" as const,
    marginTop: "0",
    marginBottom: "16px",
    color: "#18181b",
    textAlign: "center" as const,
};

const subheading = {
    fontSize: "20px",
    fontWeight: "600" as const,
    marginTop: "0",
    marginBottom: "20px",
    color: "#18181b",
    textAlign: "center" as const,
};

const paragraph = {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#52525b",
    marginBottom: "16px",
};

const featureCard = {
    backgroundColor: "#fafafa",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    textAlign: "center" as const,
};

const featureIcon = {
    fontSize: "32px",
    margin: "0 0 8px 0",
    lineHeight: "1",
};

const featureTitle = {
    fontSize: "16px",
    fontWeight: "600" as const,
    color: "#18181b",
    margin: "0 0 8px 0",
};

const featureDescription = {
    fontSize: "14px",
    lineHeight: "20px",
    color: "#71717a",
    margin: "0 0 12px 0",
};

const featureButton = {
    backgroundColor: "#f4f4f5",
    borderRadius: "8px",
    color: "#18181b",
    fontSize: "13px",
    fontWeight: "500" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "8px 16px",
    border: "1px solid #e4e4e7",
};

const ctaSection = {
    textAlign: "center" as const,
    marginTop: "24px",
    marginBottom: "24px",
};

const ctaText = {
    fontSize: "15px",
    color: "#52525b",
    marginBottom: "16px",
};

const primaryButton = {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 32px",
    boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.4)",
};

const hr = {
    borderColor: "#e4e4e7",
    margin: "24px 0",
};

const footer = {
    color: "#a1a1aa",
    fontSize: "13px",
    lineHeight: "20px",
    textAlign: "center" as const,
    marginBottom: "8px",
};

const footerLinks = {
    color: "#a1a1aa",
    fontSize: "13px",
    lineHeight: "20px",
    textAlign: "center" as const,
    marginTop: "16px",
};

const link = {
    color: "#6366f1",
    textDecoration: "none",
};

export default WelcomeEmail;
