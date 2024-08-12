import React, { useState, useEffect } from 'react';
import './User.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Card({ question, answer, showAdminButtons, onDelete, onEdit }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [editedAnswer, setEditedAnswer] = useState(answer);

  const handleClick = () => {
    if (!showAdminButtons) {
      setIsFlipped(!isFlipped);
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:3001/api/flashcards', {
        data: { question },
      });
      onDelete(question);
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put('http://localhost:3001/api/flashcards', {
        oldQuestion: question,
        newQuestion: editedQuestion,
        newAnswer: editedAnswer,
      });
      onEdit(question, editedQuestion, editedAnswer);
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing flashcard:', error);
    }
  };

  return (
    <div className={`Card ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
      <div className="CardFront">
        {isEditing ? (
          <div className="edit-card-container">
          <div className="input-group">
            <input
              type="text"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              placeholder="Edit Question"
            />
          </div>
          <div className="input-group">
            <input
            type="text"
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              placeholder="Edit Answer"
            />
          </div>
          <div className="buttons2">
            <button className="btn " onClick={handleEdit}>
            Save   
     
            </button>
            <button className="btn " onClick={() => setIsEditing(false)}>
           Cancel
           </button>
          </div>
        </div>
        
        ) : (
          <div>
            <h2>{question}</h2>
            {showAdminButtons && (
              <div className="admin-buttons">
                <button className="btn" onClick={() => setIsEditing(true)}>
                  <img src='https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png' className='w-100 h-75' alt="Edit" />
                </button>
                <button className="btn" onClick={handleDelete}>
                  <img src='https://cdn-icons-png.freepik.com/512/7184/7184039.png' className='w-100 h-75' alt="Delete" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="CardBack">
        <h1>{answer}</h1>
      </div>
    </div>
  );
}

function User() {
  const [flashcards, setFlashcards] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newCard, setNewCard] = useState({ question: '', answer: '' });
  const [addingCard, setAddingCard] = useState(false);
  const cardsPerPage = 4;

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/flashcards');
        setFlashcards(response.data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, []);

  const handleAdminClick = () => {
    setIsAdmin(!isAdmin);
  };

  const handleDeleteFlashcard = (question) => {
    setFlashcards(flashcards.filter(card => card.question !== question));
  };

  const handleEditFlashcard = (oldQuestion, newQuestion, newAnswer) => {
    setFlashcards(flashcards.map(card => 
      card.question === oldQuestion ? { question: newQuestion, answer: newAnswer } : card
    ));
  };

  const handleAddCard = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/flashcards', newCard);
      setFlashcards([...flashcards, response.data]);
      setNewCard({ question: '', answer: '' });
      setAddingCard(false);
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = flashcards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(flashcards.length / cardsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className='User'>
      <div className="button-container">
        <button className="btn" onClick={handleAdminClick}>
          {isAdmin ? 'Go to User' : 'Go to Admin'}
        </button>
        {isAdmin && (
          <button className="btn m-3" onClick={() => setAddingCard(true)}>
            Add Card
          </button>
        )}
      </div>
      <div className='cards'>
        {currentCards.map((card, index) => (
          <Card
            key={index}
            question={card.question}
            answer={card.answer}
            showAdminButtons={isAdmin}
            onDelete={handleDeleteFlashcard}
            onEdit={handleEditFlashcard}
          />
        ))}
        {addingCard && (
  <div className="add-card-container">
    <div className="input-group">
      <input
        type="text"
        placeholder="Question"
        value={newCard.question}
        onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
      />
    </div>
    <div className="input-group">
      <input
        type="text"
        placeholder="Answer"
        value={newCard.answer}
        onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
      />
    </div>
    <div className="buttons2">
      <button className="btn" onClick={handleAddCard}>
      Add          
      </button>
      <button className="btn" onClick={() => setAddingCard(false)}>
     Cancel          
      </button>
    </div>
  </div>
)}

      </div>
      <div className="pagination-container ">
        <button className="btn  m-1 p-1" onClick={handlePrevPage} disabled={currentPage === 1}>
          <img className='w-100 h-100' src='https://icons.veryicon.com/png/o/miscellaneous/frozenui/prev-1.png' alt="Previous"/>
        </button>
        <button className="btn  m-1 p-1" onClick={handleNextPage} disabled={currentPage === totalPages}>
          <img className='w-75 h-75' src='https://cdn-icons-png.flaticon.com/512/130/130884.png' alt="Next"/>
        </button>
      </div>
    </div>
  );
}

export default User;
