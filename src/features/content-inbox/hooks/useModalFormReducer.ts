import { useReducer, useCallback } from 'react';
import { ContentItem } from '../types';

interface ModalFormState {
  isOpen: boolean;
  item: ContentItem | null;
  editedValues: {
    title: string;
    category: string;
    tags: string[];
    sourceUrl: string;
    content: string;
  };
  showCategoryDropdown: boolean;
  isDirty: boolean;
  errors: {
    url?: string;
    title?: string;
  };
}

type ModalFormAction =
  | { type: 'OPEN_MODAL'; payload: ContentItem }
  | { type: 'CLOSE_MODAL' }
  | { type: 'UPDATE_FIELD'; field: keyof ModalFormState['editedValues']; value: any }
  | { type: 'TOGGLE_CATEGORY_DROPDOWN' }
  | { type: 'SET_CATEGORY_DROPDOWN'; payload: boolean }
  | { type: 'SET_ERROR'; field: keyof ModalFormState['errors']; error: string | undefined }
  | { type: 'SAVE_SUCCESS'; payload: Partial<ContentItem> }
  | { type: 'RESET_FORM' };

const initialState: ModalFormState = {
  isOpen: false,
  item: null,
  editedValues: {
    title: '',
    category: '',
    tags: [],
    sourceUrl: '',
    content: ''
  },
  showCategoryDropdown: false,
  isDirty: false,
  errors: {}
};

function modalFormReducer(state: ModalFormState, action: ModalFormAction): ModalFormState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        isOpen: true,
        item: action.payload,
        editedValues: {
          title: action.payload.metadata.title || '',
          category: action.payload.metadata.category || '',
          tags: [...action.payload.metadata.tags],
          sourceUrl: action.payload.metadata.url || '',
          content: action.payload.content || ''
        },
        showCategoryDropdown: false,
        isDirty: false,
        errors: {}
      };

    case 'CLOSE_MODAL':
      return initialState;

    case 'UPDATE_FIELD':
      return {
        ...state,
        editedValues: {
          ...state.editedValues,
          [action.field]: action.value
        },
        isDirty: true
      };

    case 'TOGGLE_CATEGORY_DROPDOWN':
      return {
        ...state,
        showCategoryDropdown: !state.showCategoryDropdown
      };

    case 'SET_CATEGORY_DROPDOWN':
      return {
        ...state,
        showCategoryDropdown: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error
        }
      };

    case 'SAVE_SUCCESS':
      if (!state.item) return state;
      return {
        ...state,
        item: {
          ...state.item,
          ...action.payload,
          metadata: {
            ...state.item.metadata,
            ...action.payload.metadata
          }
        },
        isDirty: false
      };

    case 'RESET_FORM':
      return initialState;

    default:
      return state;
  }
}

export function useModalFormReducer() {
  const [state, dispatch] = useReducer(modalFormReducer, initialState);

  const openModal = useCallback((item: ContentItem) => {
    dispatch({ type: 'OPEN_MODAL', payload: item });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const updateField = useCallback(<K extends keyof ModalFormState['editedValues']>(
    field: K,
    value: ModalFormState['editedValues'][K]
  ) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const toggleCategoryDropdown = useCallback(() => {
    dispatch({ type: 'TOGGLE_CATEGORY_DROPDOWN' });
  }, []);

  const setCategoryDropdown = useCallback((open: boolean) => {
    dispatch({ type: 'SET_CATEGORY_DROPDOWN', payload: open });
  }, []);

  const setError = useCallback((field: keyof ModalFormState['errors'], error: string | undefined) => {
    dispatch({ type: 'SET_ERROR', field, error });
  }, []);

  const saveSuccess = useCallback((updates: Partial<ContentItem>) => {
    dispatch({ type: 'SAVE_SUCCESS', payload: updates });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  return {
    state,
    actions: {
      openModal,
      closeModal,
      updateField,
      toggleCategoryDropdown,
      setCategoryDropdown,
      setError,
      saveSuccess,
      resetForm
    }
  };
}