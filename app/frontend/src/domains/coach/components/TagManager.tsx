import { useTagStore } from '../store/tagStore';
import { useAuthenticatedUser } from '../../shared/auth/hooks/useAuthenticatedUser'; // or wherever you store the token
import { useEffect, useMemo, useState } from 'react';
import { ProgramTag } from '../types/models';
import {
  Button,
  Dialog,
  IconButton,
  Input,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import React from 'react';

interface TagManagerProps {
  isOpen: boolean;
  handleClose: () => void;
}

const TagManager = ({ isOpen, handleClose }: TagManagerProps) => {
  const { token } = useAuthenticatedUser();
  const { tags, loading, error, fetchTags, addTag, updateTag, deleteTag } =
    useTagStore();
  const [tagSearchString, setTagSearchString] = useState('');
  const [editTagId, setEditTagId] = useState<number | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  console.log(tags);

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

  const handleCancelEdit = () => {
    setEditTagId(null);
    setEditTagName('');
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

  const sortedTags = useMemo(() => {
    return Object.values(tags)
      .slice()
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [tags]);

  const filteredTags = useMemo(() => {
    if (tagSearchString.trim() === '') return sortedTags;
    const lower = tagSearchString.toLowerCase();
    return sortedTags.filter((tag) => tag.name?.toLowerCase().includes(lower));
  }, [tagSearchString, sortedTags]);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="lg">
      <div className="p-6">
        <h1 className="mb-4 text-xl font-semibold">Manage Tags</h1>
        <Input
          fullWidth
          disableUnderline
          placeholder="Search tags"
          value={tagSearchString}
          onChange={(e) => setTagSearchString(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          sx={{
            mb: 2,
            px: 1,
            py: 1,
            border: '1px solid #ccc',
            backgroundColor: 'white',
          }}
        />

        {/* Tag List */}
        <div className="divide-y rounded border">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
            >
              {editTagId === tag.id ? (
                <div className="flex w-full items-center">
                  <input
                    className="flex-grow border px-2 py-1"
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                  />
                  <IconButton onClick={handleSaveTag}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={handleCancelEdit}>
                    <CancelIcon />
                  </IconButton>
                </div>
              ) : (
                <>
                  <span>{tag.name}</span>
                  <div>
                    <IconButton onClick={() => handleEditTag(tag)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTag(tag.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Tag */}
        <div className="mt-5 flex items-center space-x-2">
          <Input
            fullWidth
            disableUnderline
            placeholder="New tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            sx={{
              px: 1,
              py: 1,
              border: '1px solid #ccc',
              backgroundColor: 'white',
            }}
          />
          <Button variant="contained" onClick={handleAddTag}>
            Add Tag
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default React.memo(TagManager);
