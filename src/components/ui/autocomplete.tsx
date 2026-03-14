'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { LucideChevronDown, LucideCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutocompleteItem {
	id: number;
	name: string;
}

interface AutocompleteProps {
	value: string;
	onChange: (value: string) => void;
	items: AutocompleteItem[];
	onAddNew?: (name: string) => Promise<void>;
	placeholder?: string;
	disabled?: boolean;
}

export function Autocomplete({
	value,
	onChange,
	items,
	onAddNew,
	placeholder = 'Начните вводить...',
	disabled = false,
}: AutocompleteProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState(value);
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const filteredItems = useMemo(() => {
		if (!inputValue) return items;
		const lower = inputValue.toLowerCase();
		return items.filter((item) => item.name.toLowerCase().includes(lower));
	}, [items, inputValue]);

	const showAddNew = useMemo(() => {
		if (!inputValue || !onAddNew) return false;
		return !items.some(
			(item) => item.name.toLowerCase() === inputValue.toLowerCase()
		);
	}, [items, inputValue, onAddNew]);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (item: AutocompleteItem) => {
		onChange(item.name);
		setInputValue(item.name);
		setIsOpen(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
			setIsOpen(true);
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setHighlightedIndex((prev) =>
					prev < filteredItems.length + (showAddNew ? 1 : 0) - 1 ? prev + 1 : 0
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex((prev) =>
					prev > 0 ? prev - 1 : filteredItems.length + (showAddNew ? 1 : 0) - 1
				);
				break;
			case 'Enter':
				e.preventDefault();
				if (highlightedIndex < filteredItems.length) {
					handleSelect(filteredItems[highlightedIndex]);
				} else if (showAddNew && onAddNew) {
					onAddNew(inputValue).then(() => {
						onChange(inputValue);
						setIsOpen(false);
					});
				}
				break;
			case 'Escape':
				setIsOpen(false);
				break;
		}
	};

	const displayValue = isOpen ? inputValue : value;

	return (
		<div ref={wrapperRef} className="relative w-full">
			<div className="relative">
				<input
					ref={inputRef}
					type="text"
					value={displayValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						onChange(e.target.value);
						setIsOpen(true);
						setHighlightedIndex(0);
					}}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50"
				/>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
					disabled={disabled}
				>
					<LucideChevronDown
						className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
					/>
				</button>
			</div>

			{isOpen && (filteredItems.length > 0 || showAddNew) && (
				<div className="absolute z-50 w-full mt-1 py-1 bg-background rounded-md shadow-lg border border-border/30 max-h-60 overflow-auto">
					{filteredItems.map((item, index) => (
						<button
							key={item.id}
							type="button"
							onClick={() => handleSelect(item)}
							className={cn(
								'w-full px-3 py-2 text-left text-sm flex items-center justify-between',
								index === highlightedIndex
									? 'bg-primary/10 text-primary'
									: 'text-text hover:bg-background-light'
							)}
						>
							<span>{item.name}</span>
							{value === item.name && <LucideCheck className="h-4 w-4 text-primary" />}
						</button>
					))}
					{showAddNew && (
						<button
							type="button"
							onClick={() => {
								onAddNew?.(inputValue).then(() => {
									onChange(inputValue);
									setIsOpen(false);
								});
							}}
							className={cn(
								'w-full px-3 py-2 text-left text-sm text-primary hover:bg-background-light',
								filteredItems.length === highlightedIndex && 'bg-primary/10'
							)}
						>
							Добавить &quot;{inputValue}&quot;
						</button>
					)}
				</div>
			)}
		</div>
	);
}