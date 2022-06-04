/// <reference types="vite/client" />

// api/index.ts
interface INote {
    id: number;
    userId: number;
    userName: string;
    userAvatarUrl: string;
    dateTime: number;
    firstCharId: number;
    lastCharId: number;
    text: string;
    content: string;
}

interface IUser {
    id: number;
    name: string;
    avatarUrl: string;
    studentId: string;
}

interface ILastRead {
    pageNumber: number;
    userId: number;
}

interface IBookmarks {
    pageNumber: number;
    userId: number;
}

interface IComment {
    id: number;
    noteId: number;
    fromUserId: number;
    fromUserName: string;
    fromUserAvatarUrl: string;
    toUserId: number;
    toUserName: string;
    dateTime: number;
    content: string;
}

interface ILike {
    id: number;
    noteId: number;
    userId: number;
    userName: string;
    userAvatarUrl: string;
    dateTime: number;
}

interface IClass {
    id: number;
    name: string;
    students: IUser[];
}

// app/Book/book.ts
interface ILine {
    text: string;
    spacing: number;
    isFirstLine: boolean;
    firstCharId: number;
    spacingType: "letter" | "word";
}

interface IPage {
    lines: ILine[];
    spacing: number;
}

// app/Book/index.tsx
interface ISelection {
    firstCharId: number;
    lastCharId: number;
    text: string;
}
