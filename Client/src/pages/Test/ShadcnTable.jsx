import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"


export default function ShadcnTable() {
    return (
        <html lang="en">
            <head />
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <h1 className="text-2xl font-bold">Sonner Toast Examples</h1>
                    <Button
                        onClick={() => toast("Event has been created")}
                    >
                        Show Simple Toast
                    </Button>
                    <Button
                        onClick={() =>
                            toast.success("Profile updated successfully", {
                                description: "Your changes have been saved.",
                            })
                        }
                    >
                        Show Success Toast
                    </Button>
                    <Button
                        onClick={() =>
                            toast.error("Failed to save changes", {
                                description: "Please try again later.",
                            })
                        }
                    >
                        Show Error Toast
                    </Button>
                    <Button
                        onClick={() =>
                            toast.promise(
                                new Promise((resolve) => setTimeout(resolve, 2000)),
                                {
                                    loading: "Saving changes...",
                                    success: "Changes saved successfully",
                                    error: "Failed to save changes",
                                }
                            )
                        }
                    >
                        Show Promise Toast
                    </Button>
                </div>
                <Toaster />
            </body>
        </html>
    )
}


