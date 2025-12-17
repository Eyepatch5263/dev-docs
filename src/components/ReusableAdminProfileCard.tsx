import { formatRelativeTime } from "@/lib/admin"
import { Calendar, FileText, Layers, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { ReusableAdminProfileCardProps } from "@/app/types/reusablecard.type";

const ReusableAdminProfileCard = ({ document, userDetails }: ReusableAdminProfileCardProps) => {

    const getStatusBadge = () => {

        const statusConfig = {
            review: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
            approved: { label: "Approved", className: "bg-green-500/10 text-green-600 border-green-500/20" },
            rejected: { label: "Rejected", className: "bg-red-500/10 text-red-600 border-red-500/20" },
        };

        const config = statusConfig[document.status as keyof typeof statusConfig] || statusConfig.review;
        return <Badge variant="outline" className={`${config.className} font-medium`}>{config.label}</Badge>;
    };
    return (
        <div className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
            {/* Card Header with User Info */}
            <div className="p-6 border-b border-border bg-muted/30">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* User Avatar */}
                        {userDetails.profileImage ? (
                            <img
                                src={userDetails.profileImage}
                                alt={userDetails.altText}
                                className="w-12 h-12 rounded-full ring-2 ring-border"
                            />
                        ) : (
                            <div className={`w-12 h-12 rounded-full ${userDetails.avatarColor} flex items-center justify-center ring-2 ring-border`}>
                                <span className="text-white font-semibold text-sm">{userDetails.initials}</span>
                            </div>
                        )}

                        {/* User Details */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{userDetails.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{userDetails.email}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {getStatusBadge()}
                </div>
            </div>

            {/* Document Details */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Title</span>
                    </div>
                    <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {document.title || "Untitled Document"}
                    </h2>
                </div>
                {/* Description */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs font-medium uppercase tracking-wider">Description</span>
                    </div>
                    <h2 className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {document.description || "No description provided"}
                    </h2>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {/* Topic */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Layers className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Topic</span>
                        </div>
                        <p className="text-sm font-medium text-foreground capitalize">
                            {document.topic?.replace(/-/g, " ") || "N/A"}
                        </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Tag className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Category</span>
                        </div>
                        <p className="text-sm font-medium text-foreground capitalize">
                            {document.category?.replace(/-/g, " ") || "N/A"}
                        </p>
                    </div>

                    {/* Submitted Time */}
                    <div className="space-y-1 col-span-2">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Submitted</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            {formatRelativeTime(document.updated_at)}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ReusableAdminProfileCard