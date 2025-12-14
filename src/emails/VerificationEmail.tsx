import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface VerificationEmailProps {
    userName: string;
    verificationUrl: string;
}

export function VerificationEmail({
    userName,
    verificationUrl,
}: VerificationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email address for ExplainBytes</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>Welcome to ExplainBytes!</Heading>

                    <Text style={paragraph}>Hi {userName},</Text>

                    <Text style={paragraph}>
                        Thanks for signing up! Please verify your email address by clicking
                        the button below.
                    </Text>

                    <Section style={buttonContainer}>
                        <Button style={button} href={verificationUrl}>
                            Verify Email Address
                        </Button>
                    </Section>

                    <Text style={paragraph}>
                        This link will expire in 24 hours. If you didn&apos;t create an
                        account on ExplainBytes, you can safely ignore this email.
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        If the button doesn&apos;t work, copy and paste this link into your
                        browser:
                    </Text>
                    <Link href={verificationUrl} style={link}>
                        {verificationUrl}
                    </Link>

                    <Hr style={hr} />

                    <Text style={footer}>
                        © {new Date().getFullYear()} ExplainBytes. All rights reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px 20px",
    marginBottom: "64px",
    borderRadius: "8px",
    maxWidth: "580px",
};

const heading = {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "0",
    marginBottom: "24px",
    color: "#1a1a1a",
    textAlign: "center" as const,
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#484848",
    marginBottom: "16px",
};

const buttonContainer = {
    textAlign: "center" as const,
    marginTop: "32px",
    marginBottom: "32px",
};

const button = {
    backgroundColor: "#000000",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 28px",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "24px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "14px",
    lineHeight: "22px",
    marginBottom: "8px",
};

const link = {
    color: "#5469d4",
    fontSize: "14px",
    wordBreak: "break-all" as const,
};

export default VerificationEmail;
