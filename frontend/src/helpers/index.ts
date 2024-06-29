import { ChangeEvent, FormEvent, MouseEvent } from "react";

export type FormSubmit = FormEvent<HTMLFormElement>;
export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export const updateWebsiteTitle = (title: string) => {
  document.title = title;
};

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const handlePreventDefault = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};
export const handleStopPropagation = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.stopPropagation();
};

export const handlePreventScrolling = () => {
  const bodyElement = document.querySelector("body");
  if (bodyElement) {
    bodyElement.style.overflow = "hidden";
  }
};

export const checkValidPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length === 10) {
    // 1.check phoneNumber[0] = 0 && phoneNumber[1] != 0 ?
    const checkFirstTwoLetters =
      phoneNumber[0].charCodeAt(0) === 48 && phoneNumber[1].charCodeAt(0) >= 49 && phoneNumber[1].charCodeAt(0) <= 57;

    // 2.check phoneNumber[2->9] all is a integer character in range 0-9 ?
    const newPhoneNumber = phoneNumber.slice(2).split("");
    const checkAllLetters = newPhoneNumber.every((a) => {
      const match = a.match(/[0-9]/g);
      return match && match.length === 1;
    });

    // 3.return result
    const result = checkFirstTwoLetters && checkAllLetters;
    return result;
  } else {
    return false;
  }
};
