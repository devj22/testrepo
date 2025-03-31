import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const WelcomeTour = () => {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    
    if (!hasSeenTour) {
      // Set a slight delay to ensure all elements are loaded
      const timer = setTimeout(() => {
        setShouldShowTour(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (shouldShowTour) {
      // Initialize the tour
      const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        steps: [
          {
            element: 'nav',
            popover: {
              title: 'Welcome to Nainaland Deals',
              description: 'Looking for premium land properties? You\'re in the right place. Let us show you around!',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '.hero-section',
            popover: {
              title: 'Discover Properties',
              description: 'Explore our wide range of premium properties across South India.',
              side: 'bottom',
              align: 'center'
            }
          },
          {
            element: '.property-section',
            popover: {
              title: 'Featured Properties',
              description: 'Browse through our featured properties. Swipe to see more!',
              side: 'top',
              align: 'center'
            }
          },
          {
            element: '.about-section',
            popover: {
              title: 'About Us',
              description: 'Learn more about Nainaland Deals and why we are trusted by thousands of customers.',
              side: 'top',
              align: 'center'
            }
          },
          {
            element: '.testimonial-section',
            popover: {
              title: 'Customer Testimonials',
              description: 'Read what our happy customers have to say about us.',
              side: 'top',
              align: 'center'
            }
          },
          {
            element: '.contact-section',
            popover: {
              title: 'Get in Touch',
              description: 'Have questions? Fill out this form and we\'ll get back to you soon!',
              side: 'top',
              align: 'center'
            }
          },
          {
            element: 'footer',
            popover: {
              title: 'Stay Connected',
              description: 'Subscribe to our newsletter for updates on new properties and investment opportunities.',
              side: 'top',
              align: 'center'
            }
          }
        ],
        onDestroyStarted: () => {
          // Ask user if they want to see the tour again
          const wantToSeeAgain = window.confirm('Would you like to see this tour again next time you visit?');
          if (!wantToSeeAgain) {
            localStorage.setItem('hasSeenTour', 'true');
          }
        },
        onDestroyed: () => {
          setShouldShowTour(false);
        }
      });

      // Start the tour
      driverObj.drive();

      // Cleanup
      return () => {
        driverObj.destroy();
      };
    }
  }, [shouldShowTour]);

  return null; // This component doesn't render anything
};

export default WelcomeTour;