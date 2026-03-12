import banner_img from "../assets/banner_img.png"
import transport_card from "../assets/transport_card.png"
import food_card from "../assets/food_card.png"
import activity_card from "../assets/activity_card.png"
import accommodation_card from "../assets/accommodation_card.png"
import { useRef } from "react"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';
import { useUserStore } from "../utils/store/app_store"
import { useNavigate } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true })

export default function Home() {
    const bannerSectionRef = useRef(null);
    const curateSectionRef = useRef(null);
    const startTripSectionRef = useRef(null);
    const { user, setShowLogin } = useUserStore()
    const navigate = useNavigate();

    useGSAP(() => {
      // 1. Entrance Timeline (runs on page load)
      const initTL = gsap.timeline({
        defaults: { ease: "power3.out", duration: 2 }
      });

      initTL
        .from(".cta-text", {
          y: 30,           // Subtle slide up
          opacity: 0,
        })
        .from(".cta-button", {
          y: 20,
          opacity: 0,
        }, "-=0.6");       // Starts 0.6s before the text animation finishes (overlap)

      // 2. Scroll Animation Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bannerSectionRef.current,
          start: "top 10%", 
          end: "+=1200", 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },      
      });

      tl.to(".floaters", {
        y: "-20%",
        ease: "power2.inOut"
      })
      .to(".banner-img", {
        y: "-140%", 
        opacity: 1,
        ease: "power1.inOut"
      }, "<")
  
      // --- COLOR FLIP SECTION ---
      // We use a label "colorShift" to start these animations simultaneously
      .add("colorShift") 
      .to(bannerSectionRef.current, {
        backgroundColor: "#E03E1A", 
        duration: 0.5 
      }, "colorShift")
      .to(".cta-text", {
        color: "#FFFFFF", 
        duration: 0.5 
      }, "colorShift")
      .to(".inner-text", {
        color: "#E03E1A", 
        display: "block",
        duration: 0.5 
      }, "colorShift")
      .to(".logo-svg path", {
        fill: "#FFFFFF", 
        duration: 0.5 
      }, "colorShift")
      .to(".navbar", {
        backgroundColor: "#E03E1A", 
        duration: 0.5 
      }, "colorShift")
      .to(".login-btn", {
        backgroundColor: "#FFFFFF", 
        color: "#E03E1A",
        duration: 0.5 
      }, "colorShift")
      .to(".cta-button", {
        backgroundColor: "#FFFFFF", 
        color: "#E03E1A", 
        border: "2px solid #E03E1A",
        duration: 0.5 
      }, "colorShift");

  });

  useGSAP(() => {

    gsap.from(".curate-title, .curate-subtitle", {
      scrollTrigger: {
        trigger: ".curate-title",
        start: "top 80%",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
    });

    const gridItems = gsap.utils.toArray(".curate-grid-item");

    gridItems.forEach((item: any) => {
      const text = item.querySelector(".curate-text-group");
      const img = item.querySelector(".curate-img");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      });

      tl.from(text, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      })
      .from(img, {
        y: 350,
        scale: 0.5,
        opacity: 0,
        duration: 0.4,
        ease: "circ.out"
      }, "-=0.2");
    });

    ScrollTrigger.refresh();

  }, { scope: curateSectionRef });


  useGSAP(() => {
    // 1. Text & Button Entrance
    const textTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".start-title",
        start: "top 90%",
        toggleActions: "play reverse play reverse",
      }
    });

    textTL
      .from(".start-text-group", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .from(".start-button", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4"); // Overlap for smoothness

    // 2. Floater SVGs Animation
    // We use a separate trigger for the floaters to make them feel "weightless"
    gsap.from(".start-floater", {
      scrollTrigger: {
        trigger: startTripSectionRef.current,
        start: "top 80%",
        end: "bottom top",
        scrub: 1.5, // High scrub value makes them feel like they are floating in water
      },
      y: (i) => (i % 2 === 0 ? -60 : 60), // Alternates direction for variety
      rotation: (i) => (i % 2 === 0 ? 15 : -15),
      opacity: 0,
      duration: 2,
      stagger: 0.1,
      ease: "sine.inOut",
    });
  }, { scope: startTripSectionRef });




  return(
    <div className="w-full space-y-40">
      <section ref={bannerSectionRef} className="h-[calc(100vh-5rem)] px-8 w-full flex flex-col overflow-hidden justify-center items-center relative">
        
        <div className="lg:w-200 relative">
          <svg width="100" className="floaters absolute size-10 lg:size-20 z-30 -top-18 lg:-top-14 shadow-2xl rounded-2xl overflow-clip right-10" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2022_511)">
            <path d="M80 0H20C8.9543 0 0 8.9543 0 20V80C0 91.0457 8.9543 100 20 100H80C91.0457 100 100 91.0457 100 80V20C100 8.9543 91.0457 0 80 0Z" fill="#E03E1A"/>
            <path d="M35.4341 39.1509H66.0001V45.6157H52.523V46.0188L66.0001 57.0224V64.7712L52.314 53.4242L35.4341 64.9056V57.1717L48.0008 48.7958L44.1203 45.6157H35.4341V39.1509Z" fill="white"/>
            <path d="M54.3961 75.6603H47.8867V25H54.3961V75.6603Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_2022_511">
            <rect width="100" height="100" fill="white"/>
            </clipPath>
            </defs>
          </svg>
          <svg width="100" className="floaters absolute size-4 lg:size-8 z-30 -top-20 shadow-2xl rounded-sm overflow-clip lg:-left-20" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2022_511)">
            <path d="M80 0H20C8.9543 0 0 8.9543 0 20V80C0 91.0457 8.9543 100 20 100H80C91.0457 100 100 91.0457 100 80V20C100 8.9543 91.0457 0 80 0Z" fill="#E03E1A"/>
            <path d="M35.4341 39.1509H66.0001V45.6157H52.523V46.0188L66.0001 57.0224V64.7712L52.314 53.4242L35.4341 64.9056V57.1717L48.0008 48.7958L44.1203 45.6157H35.4341V39.1509Z" fill="white"/>
            <path d="M54.3961 75.6603H47.8867V25H54.3961V75.6603Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_2022_511">
            <rect width="100" height="100" fill="white"/>
            </clipPath>
            </defs>
          </svg>
          <svg width="66" className="floaters absolute size-8 lg:size-13 z-30 right-20 shadow-2xl rounded lg:rounded-xl overflow-clip lg:right-40 -bottom-6" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2022_516)">
            <path d="M52.8 0H13.2C5.90984 0 0 5.90984 0 13.2V52.8C0 60.0902 5.90984 66 13.2 66H52.8C60.0902 66 66 60.0902 66 52.8V13.2C66 5.90984 60.0902 0 52.8 0Z" fill="white"/>
            <path d="M52.8002 0.98999H13.2002C6.45684 0.98999 0.990234 6.45659 0.990234 13.2V52.8C0.990234 59.5434 6.45684 65.01 13.2002 65.01H52.8002C59.5436 65.01 65.0102 59.5434 65.0102 52.8V13.2C65.0102 6.45659 59.5436 0.98999 52.8002 0.98999Z" stroke="#E03E1A" stroke-opacity="0.85" stroke-width="3"/>
            <path d="M23.3862 25.8396H43.5598V30.1064H34.6649V30.3724L43.5598 37.6348V42.749L34.527 35.26L23.3862 42.8377V37.7333L31.6803 32.2052L29.1191 30.1064H23.3862V25.8396Z" fill="#E03E1A"/>
            <path d="M35.9017 49.9358H31.6055V16.5H35.9017V49.9358Z" fill="#E03E1A"/>
            </g>
            <defs>
            <clipPath id="clip0_2022_516">
            <rect width="66" height="66" fill="white"/>
            </clipPath>
            </defs>
          </svg>

          <div className="w-full relative">
            <h1 className="cta-text text-4xl lg:text-7xl outer-text text-center relative z-20 w-full mx-auto lg:leading-20 font-medium">
              Turn your journey into an adventure others can experience<span className="font-bold text-brand">.</span>
            </h1>
            <div className="border-brand absolute top-0 z-30 right-0 w-full lg:w-70 flex justify-center overflow-clip left-[50%] -translate-x-[50%]">
              <div className="w-full lg:w-200 lg:min-w-200">
                <h1 className="cta-text text-4xl lg:text-7xl inner-text hidden text-center relative z-20 w-full mx-auto lg:leading-20 font-medium">
                  Turn your journey into an adventure others can experience<span className="font-bold text-brand">.</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => {
          console.log(user)
          if(!user) {
            setShowLogin(true)
          } else {
            navigate(`/${user.id}/profile`)
          }
        }} className="cta-button h-12 lg:h-14 w-full lg:w-120 rounded-full relative z-40 bg-brand text-white font-medium mt-10 mx-auto">Start a Kit</button>
        <img src={banner_img} className="banner-img w-70 border-2 z-30 lg:z-10 border-brand/20 opacity-25 absolute top-[120%] left-1/2 -translate-x-1/2 rounded-xl overflow-clip" />
      </section>

      <section ref={curateSectionRef} className="lg:px-20 space-y-10">
        <div className="flex px-8 lg:px-0 flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="curate-title text-3xl lg:text-5xl font-medium">Curate effortlessly<span className="font-bold text-brand">.</span></h2>
          <p className="curate-subtitle text-sm lg:text-lg lg:w-[26em]">Document your travel experiences in a way that feels second nature, sharing detail in simplicity</p>
        </div>

        <div className="border-x-2 border-y-0 border-t-2 lg:border-y-2 lg:border-x-0 border-brand/20">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full curate-grid-item overflow-hidden space-y-10 lg:space-y-20 border-b-2 px-8 lg:px-10 lg:border-r-2 border-brand/20">
              <div className="mt-20 curate-text-group lg:mt-30">
                <h3 className="curate-transport-title text-2xl lg:text-3xl font-medium">Transport<span>.</span></h3>
                <p className="curate-transport-subtitle">Document how you got around</p>
              </div>
              <img src={transport_card} className="curate-img transport-img mx-auto w-100" />
            </div>

            <div className="w-full curate-grid-item overflow-hidden space-y-10 lg:space-y-20 border-b-2 px-8 lg:px-10 border-brand/20">
              <div className="mt-20 lg:mt-30 curate-text-group">
                <h3 className="curate-food-title text-2xl lg:text-3xl font-medium">Food<span>.</span></h3>
                <p className="curate-food-subtitle">Save the meals worth trying</p>
              </div>
              <img src={food_card} className="food-img curate-img mx-auto w-100" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full curate-grid-item overflow-hidden space-y-10 lg:space-y-20 border-b-2 lg:border-b-0 px-8 lg:px-10 lg:border-r-2 border-brand/20">
              <div className="mt-20 lg:mt-30 curate-text-group">
                <h3 className="curate-accommodation-title text-2xl lg:text-3xl font-medium">Accommodation<span>.</span></h3>
                <p className="curate-accommodation-subtitle">Share the places you stayed</p>
              </div>
              <img src={accommodation_card} className="accommodation-img curate-img mx-auto w-100" />
            </div>

            <div className="w-full curate-grid-item overflow-hidden space-y-10 lg:space-y-20 border-b-2 lg:border-b-0 px-8 lg:px-10 border-brand/20">
              <div className="mt-20 lg:mt-30 curate-text-group">
                <h3 className="curate-activity-title text-2xl lg:text-3xl font-medium">Activities<span>.</span></h3>
                <p className="curate-activity-stitle">Capture the experiences that made the trip</p>
              </div>
              <img src={activity_card} className="mx-auto curate-img w-100 activity-img" />
            </div>
          </div>
        </div>
      </section>

      <section ref={startTripSectionRef} className="flex flex-col justify-center px-8 items-center relative h-[50vh]">
          <svg width="31" height="51" className="absolute start-floater top-[5%] size-10 lg:size-16 right-[20%]" viewBox="0 0 31 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2022_488)">
            <path d="M1.1258e-06 14.1509H30.566V20.6157H17.0889V21.0188L30.566 32.0224V39.7712L16.88 28.4242L0 39.9056L3.38099e-07 32.1717L12.5667 23.7958L8.68624 20.6157H8.432e-07L1.1258e-06 14.1509Z" fill="#E03E1A" fill-opacity="0.85"/>
            <path d="M18.962 50.6603H12.4526V0L18.9621 2.84536e-07L18.962 50.6603Z" fill="#E03E1A" fill-opacity="0.85"/>
            </g>
            <defs>
            <clipPath id="clip0_2022_488">
            <rect width="31" height="51" fill="white"/>
            </clipPath>
            </defs>
          </svg>

          <svg width="31" height="51" className="absolute start-floater left-20 size-8 lg:size-10 right-[30%]" viewBox="0 0 31 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2022_488)">
            <path d="M1.1258e-06 14.1509H30.566V20.6157H17.0889V21.0188L30.566 32.0224V39.7712L16.88 28.4242L0 39.9056L3.38099e-07 32.1717L12.5667 23.7958L8.68624 20.6157H8.432e-07L1.1258e-06 14.1509Z" fill="#E03E1A" fill-opacity="0.85"/>
            <path d="M18.962 50.6603H12.4526V0L18.9621 2.84536e-07L18.962 50.6603Z" fill="#E03E1A" fill-opacity="0.85"/>
            </g>
            <defs>
            <clipPath id="clip0_2022_488">
            <rect width="31" height="51" fill="white"/>
            </clipPath>
            </defs>
          </svg>

          <svg width="31" height="51" className="absolute start-floater size-8 lg:size-16 -bottom-30 lg:-bottom-20 right-[40%]" viewBox="0 0 31 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2022_488)">
            <path d="M1.1258e-06 14.1509H30.566V20.6157H17.0889V21.0188L30.566 32.0224V39.7712L16.88 28.4242L0 39.9056L3.38099e-07 32.1717L12.5667 23.7958L8.68624 20.6157H8.432e-07L1.1258e-06 14.1509Z" fill="#E03E1A" fill-opacity="0.85"/>
            <path d="M18.962 50.6603H12.4526V0L18.9621 2.84536e-07L18.962 50.6603Z" fill="#E03E1A" fill-opacity="0.85"/>
            </g>
            <defs>
            <clipPath id="clip0_2022_488">
            <rect width="31" height="51" fill="white"/>
            </clipPath>
            </defs>
          </svg>

          <svg width="31" height="51" className="absolute start-floater -top-20 left-10 lg:left-[30%]" viewBox="0 0 31 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2022_488)">
            <path d="M1.1258e-06 14.1509H30.566V20.6157H17.0889V21.0188L30.566 32.0224V39.7712L16.88 28.4242L0 39.9056L3.38099e-07 32.1717L12.5667 23.7958L8.68624 20.6157H8.432e-07L1.1258e-06 14.1509Z" fill="#E03E1A" fill-opacity="0.85"/>
            <path d="M18.962 50.6603H12.4526V0L18.9621 2.84536e-07L18.962 50.6603Z" fill="#E03E1A" fill-opacity="0.85"/>
            </g>
            <defs>
            <clipPath id="clip0_2022_488">
            <rect width="31" height="51" fill="white"/>
            </clipPath>
            </defs>
          </svg>

          <div className="text-center start-text-group space-y-1 relative">
            <h2 className="text-3xl start-title lg:text-5xl font-medium">Start your next trip<span className="font-bold text-brand">.</span></h2>
            <p className="text-lg lg:w-[26em]">Let your new adventure begin here and reach everywhere</p>
          </div>
          <button onClick={() => {
            if(!user) {
              setShowLogin(true)
            } else {
              navigate(`/${user.id}/profile`)
            }
          }} 
        className="h-12 start-button lg:h-14 w-full lg:w-120 rounded-full relative z-20 bg-brand text-white font-medium mt-10 mx-auto">Create a new Kit</button>
      </section>

      <section className="h-18 flex items-center text-sm justify-center w-full bg-brand text-white font-medium">&copy; Kits by Odyss 2026</section>

      
    </div>
  );
}