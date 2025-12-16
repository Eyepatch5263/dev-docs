"use client";

import { FileCheck, FileX, FileClock, FileEdit } from "lucide-react";

interface UserStatsProps {
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    draftCount: number;
}

export default function UserStats({ pendingCount, approvedCount, rejectedCount, draftCount }: UserStatsProps) {
    const stats = [
        {
            label: "Draft",
            value: draftCount,
            icon: FileEdit,
            color: "text-gray-600",
            bgColor: "bg-gray-500/10",
            borderColor: "border-gray-500/20",
        },
        {
            label: "Pending Review",
            value: pendingCount,
            icon: FileClock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/20",
        },
        {
            label: "Approved",
            value: approvedCount,
            icon: FileCheck,
            color: "text-green-600",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20",
        },
        {
            label: "Rejected",
            value: rejectedCount,
            icon: FileX,
            color: "text-red-600",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-xl border ${stat.borderColor} ${stat.bgColor} p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div className={`${stat.bgColor} p-3 rounded-full`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>

                        {/* Decorative gradient */}
                        <div className={`absolute -right-8 -bottom-8 w-24 h-24 ${stat.bgColor} rounded-full opacity-50 blur-2xl`} />
                    </div>
                );
            })}
        </div>
    );
}
