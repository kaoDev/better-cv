import { Briefcase, FileText, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Better CV</h1>
        </div>
        <nav className="mt-6">
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
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
      <Toaster />
    </div>
  );
}
