import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full">
				<AppSidebar />
				<main className="flex-1 bg-background">{children}</main>
			</div>
		</SidebarProvider>
	);
}
