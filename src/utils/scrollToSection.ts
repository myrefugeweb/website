export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    // Use requestAnimationFrame for smoother scrolling without snap
    requestAnimationFrame(() => {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  }
};

