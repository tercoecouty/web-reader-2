import usersData from "./data/users.json";
import bookmarksData from "./data/bookmarks.json";
import notesData from "./data/notes.json";
import commentsData from "./data/comments.json";
import likesData from "./data/likes.json";
import classesData from "./data/classes.json";
import lastReadData from "./data/lastRead.json";

class Storage<T> {
    private key: string;
    private value: T[];

    constructor(key: string, defaultValue: T[]) {
        this.key = key;

        const item = localStorage.getItem(key);
        if (item) this.value = JSON.parse(item) as T[];
        else this.value = defaultValue;
    }

    get() {
        return this.value;
    }

    set(value: T[]) {
        this.value = value;
        if (import.meta.env.DEV) this.save();
    }

    add(item: T) {
        this.set(this.value.concat(item));
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.value));
    }
}

class Api {
    private users = new Storage<IUser>("users", usersData as IUser[]);
    private bookmarks: Storage<IBookmarks> = new Storage("bookmarks", bookmarksData as IBookmarks[]);
    private notes: Storage<INote> = new Storage("notes", notesData as INote[]);
    private comments = new Storage("comments", commentsData as IComment[]);
    private likes = new Storage("likes", likesData as ILike[]);
    private classes = new Storage("classes", classesData as IClass[]);

    private lastRead: Storage<ILastRead> = new Storage("lastRead", lastReadData as ILastRead[]);
    private currentUser: IUser = null;
    private currentBookId: number = null;

    constructor() {
        this.currentUser = this.users.get()[0];
    }

    async getCurrentUser() {
        return this.currentUser;
    }

    async setCurrentUser(userId: number) {
        const _user = this.users.get().find((user) => user.id === userId);
        if (_user) {
            this.currentUser = _user;
        }
    }

    async getBookText(bookId: number) {
        let bookText = "";
        if (bookId === 1) {
            const res = await fetch("text-demo.txt");
            bookText = await res.text();
        } else if (bookId === 2) {
            const res = await fetch("text-zh.txt");
            bookText = await res.text();
        } else if (bookId === 3) {
            const res = await fetch("text-en.txt");
            bookText = await res.text();
        }

        this.currentBookId = bookId;
        return bookText;
    }

    async getBookmarks(userId: number) {
        return this.bookmarks
            .get()
            .filter(
                (item) =>
                    item.bookId === this.currentBookId && item.bookId === this.currentBookId && item.userId === userId
            )
            .map((item) => item.pageNumber);
    }

    async addBookmark(pageNumber: number) {
        this.bookmarks.add({
            bookId: this.currentBookId,
            userId: this.currentUser.id,
            pageNumber,
        });
    }

    async deleteBookmark(pageNumber: number) {
        this.bookmarks.set(
            this.bookmarks
                .get()
                .filter(
                    (item) =>
                        item.bookId === this.currentBookId &&
                        item.userId != this.currentUser.id &&
                        item.pageNumber !== pageNumber
                )
        );
    }

    async getLastRead() {
        const lastRead = this.lastRead.get().filter((item) => item.userId === this.currentUser.id);
        if (lastRead.length === 0) return 1;
        return lastRead[0].pageNumber;
    }

    async setLastRead(pageNumber: number) {
        if (this.lastRead.get().length === 0) {
            this.lastRead.add({
                bookId: this.currentBookId,
                userId: this.currentUser.id,
                pageNumber,
            });
        }
        this.lastRead.set(
            this.lastRead.get().map((item) => {
                if (item.userId === this.currentUser.id) {
                    return {
                        bookId: this.currentBookId,
                        userId: this.currentUser.id,
                        pageNumber,
                    };
                } else {
                    return item;
                }
            })
        );
    }

    async getNotes(userId: number) {
        return this.notes.get().filter((item) => item.bookId === this.currentBookId && item.userId == userId);
    }

    async addNote(firstCharId: number, lastCharId: number, text: string) {
        const _notes = this.notes.get();
        const note: INote = {
            id: _notes.length === 0 ? 1 : _notes[_notes.length - 1].id + 1,
            bookId: this.currentBookId,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            dateTime: Date.now(),
            firstCharId,
            lastCharId,
            text,
            content: "",
        };
        this.notes.add(note);
        return note;
    }

    async deleteNote(noteId: number) {
        this.notes.set(this.notes.get().filter((item) => item.id !== noteId));
        this.comments.set(this.comments.get().filter((item) => item.noteId !== noteId));
        this.likes.set(this.likes.get().filter((item) => item.noteId !== noteId));
    }

    async setNoteContent(noteId: number, content: string) {
        this.notes.set(
            this.notes.get().map((item) => {
                if (item.id === noteId) {
                    return {
                        ...item,
                        content,
                    };
                } else {
                    return item;
                }
            })
        );
    }

    async getComments(noteId: number) {
        return this.comments.get().filter((item) => item.noteId === noteId);
    }

    async addComment(noteId: number, toUserId: number, toUserName: string, content: string) {
        const _comments = this.comments.get();
        const comment: IComment = {
            id: _comments.length === 0 ? 1 : _comments[_comments.length - 1].id + 1,
            noteId,
            fromUserId: this.currentUser.id,
            fromUserName: this.currentUser.name,
            toUserId,
            toUserName,
            dateTime: Date.now(),
            content,
        };
        this.comments.add(comment);
        return comment;
    }

    async setCommentContent(commentId: number, content: string) {
        this.comments.set(
            this.comments.get().map((item) => {
                if (item.id === commentId) {
                    return {
                        ...item,
                        content,
                    };
                } else {
                    return item;
                }
            })
        );
    }

    async deleteComment(commentId: number) {
        this.comments.set(this.comments.get().filter((item) => item.id !== commentId));
    }

    async getLikes(noteId: number) {
        return this.likes.get().filter((item) => item.noteId === noteId);
    }

    async addLike(noteId: number) {
        const _likes = this.likes.get();
        const like: ILike = {
            id: _likes.length === 0 ? 1 : _likes[_likes.length - 1].id + 1,
            noteId,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            dateTime: Date.now(),
        };
        this.likes.add(like);
        return like;
    }

    async deleteLike(likeId: number) {
        this.likes.set(this.likes.get().filter((item) => item.id !== likeId));
    }

    async getClasses() {
        return this.classes.get();
    }
}

const api = new Api();

export default api;
