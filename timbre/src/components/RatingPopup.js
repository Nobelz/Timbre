import Modal from 'react-bootstrap/Modal';
import { Container, Form, Button } from "react-bootstrap";
import { useState } from 'react';


export default function UpdateRatingPopup({ show, onHide, updateBackend }) {
  
  const [rating, setRating] = useState(0); // State to manage the rating
  
  // Function to handle setting the rating
  const handleSetRating = (selectedRating) => {
    setRating(selectedRating);
  };

  let focusedElementBeforeModal;
  const modal = document.getElementById('modal');
  const modalOverlay = document.querySelector('.modal-overlay');

  window.onload = () => {
    const addReview = document.getElementById('review-add-btn');
    addReview.id = 'review-add-btn';
    addReview.innerHTML = '+';
    addReview.setAttribute('aria-label', 'add review');
    addReview.title = 'Add Review';
    addReview.addEventListener('click', openModal);
    addReview.click();
  } 

  const openModal = () => {
    // Save current focus
    focusedElementBeforeModal = document.activeElement;

    // Listen for and trap the keyboard
    modal.addEventListener('keydown', trapTabKey);

    // Listen for indicators to close the modal
    modalOverlay.addEventListener('click', closeModal);
    // Close btn
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeModal);

    // submit form
    const form = document.getElementById('review-form');
    form.addEventListener('submit', submitAddReview, false);

    // Find all focusable children
    var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    var focusableElements = modal.querySelectorAll(focusableElementsString);
    // Convert NodeList to Array
    focusableElements = Array.prototype.slice.call(focusableElements);

    var firstTabStop = focusableElements[0];
    var lastTabStop = focusableElements[focusableElements.length - 1];

    // Show the modal and overlay
    modal.classList.add('show');
    modalOverlay.classList.add('show');

    // Focus first child
    // firstTabStop.focus();
    const reviewName = document.getElementById('reviewName');
    reviewName.focus();

    function trapTabKey(e) {
      // Check for TAB key press
      if (e.keyCode === 9) {

        // SHIFT + TAB
        if (e.shiftKey) {
          if (document.activeElement === firstTabStop) {
            e.preventDefault();
            lastTabStop.focus();
          }

        // TAB
        } else {
          if (document.activeElement === lastTabStop) {
            e.preventDefault();
            firstTabStop.focus();
          }
        }
      }

      // ESCAPE
      if (e.keyCode === 27) {
        closeModal();
      }
    }
  };

  const submitAddReview = (e) => {
    // console.log(e);
    console.log('Form subbmitted!');
    e.preventDefault();
    closeModal();
  };

  const closeModal = () => {
    // Hide the modal and overlay
    modal.classList.remove('show');
    modalOverlay.classList.remove('show');

    const form = document.getElementById('review-form');
    form.reset();
    // Set focus back to element that had it before the modal was opened
    focusedElementBeforeModal.focus();
  };

  const setFocus = (evt) => {
    const rateRadios = document.getElementsByName('rate');
    const rateRadiosArr = Array.from(rateRadios);
    const anyChecked = rateRadiosArr.some(radio => { return radio.checked === true; });
    // console.log('anyChecked', anyChecked);
    if (!anyChecked) {
      const star1 = document.getElementById('star1');
      star1.focus();
      // star1.checked = true;
    }
  };

  const navRadioGroup = (evt) => {
    // console.log('key', evt.key, 'code', evt.code, 'which', evt.which);
    // console.log(evt);
    
    const star1 = document.getElementById('star1');  
    const star2 = document.getElementById('star2');  
    const star3 = document.getElementById('star3');  
    const star4 = document.getElementById('star4');  
    const star5 = document.getElementById('star5');  

    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(evt.key)) {
      evt.preventDefault();
      // console.log('attempting return');
      if (evt.key === 'ArrowRight' || evt.key === 'ArrowDown') {
        switch(evt.target.id) {
          case 'star1':
            star2.focus();
            star2.checked = true;
            break;
          case 'star2':
            star3.focus();
            star3.checked = true;
            break;
          case 'star3':
            star4.focus();
            star4.checked = true;
            break;
          case 'star4':
            star5.focus();
            star5.checked = true;
            break;
          case 'star5':
            star1.focus();
            star1.checked = true;
            break;
        }
      } else if (evt.key === 'ArrowLeft' || evt.key === 'ArrowUp') {
        switch(evt.target.id) {
          case 'star1':
            star5.focus();
            star5.checked = true;
            break;
          case 'star2':
            star1.focus();
            star1.checked = true;
            break;
          case 'star3':
            star2.focus();
            star2.checked = true;
            break;
          case 'star4':
            star3.focus();
            star3.checked = true;
            break;
          case 'star5':
            star4.focus();
            star4.checked = true;
            break;
        }
      }
    }

  };
  
  return (
    <Modal show={show} onHide={onHide} scrollable={true} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rate this song</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              style={{ cursor: 'pointer', fontSize: '24px' }}
              onClick={() => handleSetRating(value)}
            >
              {value <= rating ? '★' : '☆'}
            </span>
          ))}
        </div>        
      </Modal.Body>
    </Modal>
  );

}