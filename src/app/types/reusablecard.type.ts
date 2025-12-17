import { DocumentWithUser } from "./editor.type";

export interface ReusableAdminProfileCardProps {
    document: DocumentWithUser,
    userDetails: {
        profileImage: string | null,
        altText: string,
        name: string,
        email: string,
        initials: string,
        avatarColor: string,
    }
}