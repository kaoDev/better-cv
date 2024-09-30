import { Briefcase, FileText, Menu, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Toaster } from "~/components/ui/toaster";
import { getSession } from "~/lib/session";
import { importDetailsFromPdf } from "./_actions/importDetailsFromPdf";
import { LogoutButton } from "./_components/LogoutButton";
import { PdfImport } from "./_components/PdfImport";

export const maxDuration = 60;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();

	if (!session) {
		return redirect("/api/auth/signin");
	}

	return (
		<div className="flex min-h-screen flex-col bg-background lg:flex-row">
			<Sheet>
				<header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4 lg:hidden">
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" aria-label="Open menu">
							<Menu className="h-6 w-6" />
						</Button>
					</SheetTrigger>
					<h1 className="ml-4 text-lg font-semibold">Better CV</h1>
				</header>
				<SheetContent side="left" className="w-64 p-0">
					<Sidebar />
				</SheetContent>
			</Sheet>

			<aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 overflow-y-auto border-r bg-background lg:block">
				<Sidebar />
			</aside>

			<div className="flex flex-1 flex-col">
				<header className="sticky top-0 z-30 hidden h-16 items-center border-b bg-background px-6 lg:flex">
					<h1 className="text-lg font-semibold">Better CV</h1>
				</header>
				<main className="flex-1 overflow-auto p-6">{children}</main>
			</div>

			<Toaster />
		</div>
	);
}

function Sidebar() {
	return (
		<div className="flex h-full flex-col">
			<div className="sticky top-0 bg-background p-4 lg:hidden">
				<h1 className="text-2xl font-bold">Better CV</h1>
			</div>
			<nav className="space-y-1 px-2 py-4">
				<Link href="/personal-info">
					<Button variant="ghost" className="w-full justify-start">
						<UserCircle className="mr-2 h-4 w-4" />
						Personal Info
					</Button>
				</Link>
				<Link href="/work-experience">
					<Button variant="ghost" className="w-full justify-start">
						<Briefcase className="mr-2 h-4 w-4" />
						Work Experience
					</Button>
				</Link>
				<Link href="/job-applications">
					<Button variant="ghost" className="w-full justify-start">
						<FileText className="mr-2 h-4 w-4" />
						Job Applications
					</Button>
				</Link>
			</nav>
			<div className="px-4 py-6">
				<PdfImport importExperienceFromPdf={importDetailsFromPdf} />
			</div>
			<div className="mt-auto px-2 py-4">
				<Link href="/account">
					<Button variant="ghost" className="w-full justify-start">
						<Settings className="mr-2 h-4 w-4" />
						Account
					</Button>
				</Link>
				<LogoutButton />
			</div>
		</div>
	);
}
