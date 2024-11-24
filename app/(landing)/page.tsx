// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// const LandingPage = () => {
//     return ( 
//         <div>
//             Landing Page (Unprotected)
//             <div>
//                 <Link href="/sign-in">
//                     <Button>
//                         Login
//                     </Button>
//                 </Link>
//                 <Link href="/sign-up">
//                     <Button>
//                         Register
//                     </Button>
//                 </Link>
//             </div>
//         </div>
//      );
// }
 
// export default LandingPage;
import { LandingContent } from "@/components/landing-content";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navbar";

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
