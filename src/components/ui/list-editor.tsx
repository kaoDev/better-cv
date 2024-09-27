"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type ListEditorProps<T> = {
  items: T[];
  onAdd: (item: Omit<T, "id">) => Promise<void>;
  onEdit: (id: string, item: Omit<T, "id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  renderItem: (item: T) => React.ReactNode;
  renderForm: (
    item: T | null,
    onSave: (item: Omit<T, "id">) => Promise<void>,
  ) => React.ReactNode;
  itemName: string;
};

export function ListEditor<T extends { id: string }>({
  items,
  onAdd,
  onEdit,
  onDelete,
  renderItem,
  renderForm,
  itemName,
}: ListEditorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const handleSave = async (item: Omit<T, "id">) => {
    if (editingItem) {
      await onEdit(editingItem.id, item);
    } else {
      await onAdd(item);
    }
    setIsOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{itemName}s</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>Add {itemName}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Edit ${itemName}` : `Add ${itemName}`}
              </DialogTitle>
            </DialogHeader>
            {renderForm(editingItem, handleSave)}
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded bg-neutral-100 p-2 dark:bg-neutral-900"
          >
            {renderItem(item)}
            <div>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingItem(item);
                  setIsOpen(true);
                }}
              >
                Edit
              </Button>
              <Button variant="ghost" onClick={() => onDelete(item.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
