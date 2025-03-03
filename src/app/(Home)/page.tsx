"use client";

import { IconCircleChevronRight } from "@tabler/icons-react";

const Hero = () => {
  return (
    <>
      <section className="bg-base-300 h-[calc(100vh-5rem)] flex items-center">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl text-base-content font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Prompt-2-Dataset | AI-driven dataset generator
            </h1>
            <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
              Prompt-2-Dataset will essentially be an AI-driven dataset
              generator that takes in a user's project idea and outputs a
              structured dataset along with model recommendations.
            </p>
            <a
              href="#"
              className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
            >
              Get Started
              <IconCircleChevronRight />
            </a>
            <a
              href="#"
              className="btn btn-outline text-base font-medium text-center rounded-lg mr-4"
            >
              Learn More
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/bg.png" alt="Prompt Engineer" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
