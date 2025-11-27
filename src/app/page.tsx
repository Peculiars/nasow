"use client"
import ExploreOurCourses from "../features/landing/ExploreOurCourses";
import FlashcardsLanding from "../features/landing/Flashcard";
import Hero from "../features/landing/Hero";
import MeetOurLecturers from "../features/landing/MeetOurLecturers";
import MeetTheExecutives from "../features/landing/MeetTheExecutives";
import MeetTheHOD from "../features/landing/MeetTheHOD";
import NasowiteOfWeek from "../features/landing/NasowiteOfWeek";
import OurSponsors from "../features/landing/OurSponsors";
import UpcomingNewsAndEvents from "../features/landing/UpcomingNewsAndEvents";

export default function Home() {
  return (
    <main>
      <Hero />
      <NasowiteOfWeek/>
      <FlashcardsLanding />
      <ExploreOurCourses/>
      <MeetTheHOD/>
      <MeetOurLecturers/>
      <MeetTheExecutives/>
      <OurSponsors/>
      <UpcomingNewsAndEvents/>
    </main>
  );
}
