/// <reference types="vite/client" />

// api/index.ts
interface INote {
    id: number;
    bookId: number;
    userId: number;
    userName: string;
    dateTime: number;
    firstCharId: number;
    lastCharId: number;
    text: string;
    content: string;
    imageUrls: string[];
}

interface IUser {
    id: number;
    name: string;
    account: string;
    role: "student" | "teacher";
}

interface ILastRead {
    bookId: number;
    userId: number;
    pageNumber: number;
}

interface IBookmarks {
    bookId: number;
    userId: number;
    pageNumber: number;
}

interface IComment {
    id: number;
    noteId: number;
    fromUserId: number;
    fromUserName: string;
    toUserId: number;
    toUserName: string;
    dateTime: number;
    content: string;
    imageUrls: string[];
}

interface ILike {
    id: number;
    noteId: number;
    userId: number;
    userName: string;
    dateTime: number;
}

interface IClass {
    id: number;
    name: string;
    students: IUser[];
}

interface IBook {
    id: number;
    title: string;
    author: string;
    path: string;
}

interface IBookshelfItem {
    id: number;
    title: string;
    author: string;
}

// app/Book/book.ts
interface ILine {
    text: string;
    spacing: number;
    isFirstLine: boolean;
    firstCharId: number;
    spacingType: "letter" | "word";
    indent: number;
}

interface IPage {
    lines: ILine[];
    spacing: number;
    lineSpacing: number;
}

interface IBookLayoutOptions {
    lineSpacing: number;
    indent: number;
}

// app/Book/index.tsx
interface ISelection {
    firstCharId: number;
    lastCharId: number;
    text: string;
}
