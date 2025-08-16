import { useTagStore } from '../store/tagStore';
import { useAuthenticatedUser } from '../../../shared/auth/hooks/useAuthenticatedUser'; 
import { useEffect, useMemo, useRef, useState } from 'react';
import { Program, ProgramTag } from '../types/models';
import {
  Dialog,
  Input,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

interface TagManagerProps {
  isOpen: boolean;
  handleClose: () => void;
  selectedProgram: Program | null;
  handleAddTagToProgram: (programId: number, tagId: number) => void;
}

const TagManager = ({ isOpen, handleClose, selectedProgram, handleAddTagToProgram }: TagManagerProps) => {
  const { token } = useAuthenticatedUser();
  const { tags, fetchTags, addTag, updateTag, deleteTag } =
    useTagStore();
  const [tagSearchString, setTagSearchString] = useState('');
  const [editTagId, setEditTagId] = useState<number | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [addedTagIds, setAddedTagIds] = useState<Set<number>>(new Set());
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const handleAddTag = async () => {
    if (!newTagName.trim() || !token) return;
    await addTag(token, newTagName.trim());
    setNewTagName('');
  };

  const handleEditTag = (tag: ProgramTag) => {
    setEditTagId(tag.id);
    setEditTagName(tag.name);
  };

  const handleSaveTag = async () => {
    if (editTagId !== null && token) {
      await updateTag(token, editTagId, editTagName);
      setEditTagId(null);
      setEditTagName('');
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!token) return;
    await deleteTag(token, id);
  };

  useEffect(() => {
    if (token) {
      fetchTags(token);
    }
  }, [token, fetchTags]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [editTagId]);

  useEffect(() => {
    if (isOpen) {
      setActiveProgram(selectedProgram ?? null);
      setAddedTagIds(new Set());
      setEditTagId(null);
      setEditTagName('');
      setTagSearchString('');
      setNewTagName('');
    } 
    
  }, [isOpen, selectedProgram]);

  const sortedTagAndProgramFilteredTags = useMemo(() => {
    const sorted = Object.values(tags)
      .slice()
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return activeProgram 
      ? sorted.filter((tag) => 
        !activeProgram.tags.some((t) => t.id === tag.id) 
        && !addedTagIds.has(tag.id)) 
      : sorted;
  }, [tags, activeProgram, addedTagIds]);

  const searchFilteredTags = useMemo(() => {
    if (tagSearchString.trim() === '') return sortedTagAndProgramFilteredTags;
    const lower = tagSearchString.toLowerCase();
    return sortedTagAndProgramFilteredTags.filter((tag) => tag.name?.toLowerCase().includes(lower));
  }, [tagSearchString, sortedTagAndProgramFilteredTags]);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm" sx={{ml: '200px'}}>
      <div className="flex h-[700px] flex-col p-6">
        <h1 className="mb-4 text-xl font-semibold">Tags</h1>
        <Input
          fullWidth
          disableUnderline
          placeholder="Search tags"
          value={tagSearchString}
          onChange={(e) => setTagSearchString(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{fontSize: 20}}/>
            </InputAdornment>
          }
          sx={{
            mb: 2,
            px: 1,
            py: 1,
            border: '1px solid #ccc',
            backgroundColor: 'white',
            borderRadius: 1,
            fontSize: 14
          }}
        />

        {/* Tag List */}
        <div className="rounded border overflow-scroll flex-grow">
          {searchFilteredTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-blue-100 hover:shadow-md"
            >
              {/* If editing the tag */}
              {editTagId === tag.id ? (
                <div className="flex w-full items-center text-sm" id={`tag-edit-form-${tag.id}`}>
                  <input
                    ref={inputRef}
                    aria-label={`Edit name for ${tag.name}`}
                    className="flex-grow border px-2 py-1"
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveTag();
                      }
                    }}
                    onBlur={() => {
                      handleSaveTag();
                    }}
                  />
                </div>
              ) : (
                <>
                  <span 
                    className={`text-sm flex-grow ${!selectedProgram ? 'cursor-text' : ''}`} 
                    onClick={() => {
                        if (!selectedProgram) handleEditTag(tag);
                      }
                    }
                  >
                      {tag.name}
                  </span>
                  <div>
                    {/** Adding tags to a program */}
                    {activeProgram ? (
                      <div>
                        <button
                          type="button"
                          className="w-[140px] rounded-md bg-[var(--blue-button)] px-3 py-2 text-white cursor-pointer text-sm"
                          onClick={() => {
                            handleAddTagToProgram(activeProgram.id, tag.id)
                            setAddedTagIds((prev) => new Set(prev).add(tag.id));
                          }}
                        >
                          Add to Program
                        </button>
                      </div>
                    ) : (
                    <div>
                      {/** Viewing all tags */}
                      <button
                        type="button"
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-sm rounded-md cursor-pointer text-white bg-red-500 p-1 w-15 hover:bg-red-900"
                      >
                        Delete
                      </button>
                    </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Tag */}
        <div>
          <h2 className="mt-5 mb-2 font-semibold">Add New Tag</h2>
          <div className="flex items-center space-x-2">
            <Input
              fullWidth
              disableUnderline
              placeholder="New tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              sx={{
                px: 1,
                py: 0.5,
                border: '1px solid #ccc',
                backgroundColor: 'white',
                borderRadius: '5px',
                fontSize: 14
              }}
            />
            <button 
              type='button' onClick={handleAddTag}
              className="text-sm h-[38px] w-[100px] rounded-md bg-[var(--blue-button)] px-3 py-2 text-white cursor-pointer"
            >
              Add Tag
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default React.memo(TagManager);
