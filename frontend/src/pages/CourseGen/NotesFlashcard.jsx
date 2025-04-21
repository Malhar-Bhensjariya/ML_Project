import React from 'react';
import { BookOpen, Layers } from 'lucide-react';
import notes from '../../assets/notes.png';
import flashcard from '../../assets/flashcard.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotesFlashcard = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { t } = useTranslation();
  const handleNavigateToFlashcards = () => {
    navigate(`/flashcards/${courseId}`);
  };

  const handleNavigateToNotes = () => {
    navigate(`/notes/${courseId}`);
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 mt-6 justify-center md:mx-0 mx-4">
      {/* Notes Card */}
      <div className="w-full md:w-1/2 bg-blue-50 rounded-2xl shadow-lg p-5">
        <div className="flex items-center mb-4">
          <BookOpen className="text-blue-600 mr-3" size={24} />
          <h2 className="text-xl font-bold text-blue-900">
            {t('notes.title')}
          </h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center">
          <img src={notes} alt={t('notes.title')} className="max-w-full max-h-full object-contain" />
        </div>
        <p className="text-blue-800 mb-4 text-sm leading-relaxed">
          {t('notes.description')}
        </p>
        <button 
          onClick={handleNavigateToNotes}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300 text-base flex items-center justify-center space-x-2"
        >
          <BookOpen size={16} />
          <span>{t('notes.button')}</span>
        </button>
      </div>

      {/* Flashcards Card */}
      <div className="w-full md:w-1/2 bg-green-50 rounded-2xl shadow-lg p-5">
        <div className="flex items-center mb-4">
          <Layers className="text-green-600 mr-3" size={24} />
          <h2 className="text-xl font-bold text-green-900">
            {t('flashcards.title')}
          </h2>
        </div>
        <div className="mb-4 h-40 flex items-center justify-center">
          <img src={flashcard} alt={t('flashcards.title')} className="max-w-full max-h-full object-contain" />
        </div>
        <p className="text-green-800 mb-4 text-sm leading-relaxed">
          {t('flashcards.description')}
        </p>
        <button 
          onClick={handleNavigateToFlashcards}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-300 text-base flex items-center justify-center space-x-2"
        >
          <Layers size={16} />
          <span>{t('flashcards.button')}</span>
        </button>
      </div>
    </div>
  );
};

export default NotesFlashcard;