import ExploreOurCourses from "../features/landing/ExploreOurCourses";
import FlashcardsLanding from "../features/landing/Flashcard";
import Hero from "../features/landing/Hero";
import MeetOurLecturers from "../features/landing/MeetOurLecturers";
import MeetTheExecutives from "../features/landing/MeetTheExecutives";
import MeetTheHOD from "../features/landing/MeetTheHOD";
import NasowiteOfWeek from "../features/landing/NasowiteOfWeek";
import OurSponsors from "../features/landing/OurSponsors";
import QuizLanding from "../features/landing/QuizLanding";
import UpcomingNewsAndEvents from "../features/landing/UpcomingNewsAndEvents";
import ScrollAnimationWrapper from "../components/ScrollAnimationWrapper";
import BusinessBannerCarousel from "../features/landing/BusinessBannerCarousel";

export default function Home() {
  return (
    <main>
      <ScrollAnimationWrapper animation="fade-up">
        <Hero />
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="fade-up" delay={0.1}>
        <NasowiteOfWeek/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="zoom-in">
        <FlashcardsLanding />
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="fade-up">
        <QuizLanding/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="fade-up" delay={0.15}>
        <ExploreOurCourses/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="fade-right">
        <MeetTheHOD/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="fade-up">
        <MeetOurLecturers/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="zoom-in">
        <MeetTheExecutives/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="zoom-in">
        <BusinessBannerCarousel />
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="fade-up">
        <OurSponsors/>
      </ScrollAnimationWrapper>
      
      <ScrollAnimationWrapper animation="fade-up" delay={0.1}>
        <UpcomingNewsAndEvents/>
      </ScrollAnimationWrapper>
    </main>
  );
}
