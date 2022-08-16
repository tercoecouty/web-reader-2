import usersData from "./data/users.json";
import bookmarksData from "./data/bookmarks.json";
import notesData from "./data/notes.json";
import commentsData from "./data/comments.json";
import likesData from "./data/likes.json";
import classesData from "./data/classes.json";
import lastReadData from "./data/lastRead.json";
import BooksData from "./data/books.json";

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
        this.save();
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
    private books = new Storage("books", BooksData as IBook[]);

    private lastRead: Storage<ILastRead> = new Storage("lastRead", lastReadData as ILastRead[]);
    private currentUser: IUser = null;
    private currentBookId: number = null;

    constructor() {
        this.currentUser = this.users.get()[0];
        this.currentBookId = 1;
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

    async getBookshelf() {
        return this.books.get().map((book) => {
            const { id, title, author } = book;
            return { id, title, author };
        });
    }

    async getBookText(bookId: number) {
        let book = this.books.get().find((book) => book.id === bookId);
        if (!book) book = this.books.get()[0];

        const res = await fetch(book.path);
        const bookText = await res.text();
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
        const lastRead = this.lastRead.get().filter((item) => {
            return item.userId === this.currentUser.id && item.bookId === this.currentBookId;
        });
        if (lastRead.length === 0) return 1;
        return lastRead[0].pageNumber;
    }

    async setLastRead(pageNumber: number) {
        const lastReadData = this.lastRead.get();
        const lastReadItem = lastReadData.find((item) => {
            return item.userId === this.currentUser.id && item.bookId === this.currentBookId;
        });
        if (!lastReadItem) {
            this.lastRead.add({
                bookId: this.currentBookId,
                userId: this.currentUser.id,
                pageNumber,
            });
        } else {
            lastReadItem.pageNumber = pageNumber;
            this.lastRead.set(lastReadData);
        }
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
            imageUrls: [],
        };
        this.notes.add(note);
        return note;
    }

    async deleteNote(noteId: number) {
        this.notes.set(this.notes.get().filter((item) => item.id !== noteId));
        this.comments.set(this.comments.get().filter((item) => item.noteId !== noteId));
        this.likes.set(this.likes.get().filter((item) => item.noteId !== noteId));
    }

    async updateNote(noteId: number, content: string, files: File[]) {
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        this.notes.set(
            this.notes.get().map((item) => {
                if (item.id === noteId) {
                    return {
                        ...item,
                        content,
                        imageUrls,
                    };
                } else {
                    return item;
                }
            })
        );
        return imageUrls;
    }

    async getComments(noteId: number) {
        return this.comments.get().filter((item) => item.noteId === noteId);
    }

    async addComment(noteId: number, toUserId: number, toUserName: string, content: string, files: File[]) {
        const _comments = this.comments.get();
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        const comment: IComment = {
            id: _comments.length === 0 ? 1 : _comments[_comments.length - 1].id + 1,
            noteId,
            fromUserId: this.currentUser.id,
            fromUserName: this.currentUser.name,
            toUserId,
            toUserName,
            dateTime: Date.now(),
            content,
            imageUrls,
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
