import { Button } from "@/components/ui/button";
import { signInWithGitHub } from "@/actions/auth/oauth-actions";
import { Github } from "lucide-react";

export function GitHubSignInButton() {
  return (
    <form action={signInWithGitHub}>
      <Button type="submit" variant="outline" className="w-full">
        <Github className="mr-2 w-5 h-5" />
        Continue with GitHub
      </Button>
    </form>
  );
}
