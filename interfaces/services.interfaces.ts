

export interface bookServiceInterface {
    addBook(title:string, author:string, category: string, isbn: number, description:string, price:number, add_by :string) : Promise<object>,
    getAllBooks(page:number, search: any) : Promise<object>,
    getBook(bookID: string) : Promise<object>,
    deleteBook(bookID: string) : Promise<object>,
    updateBook(bookID: string, title:string, author:string, category: string, isbn: number, description:string, price:number, updated_by :string) : Promise<object>
}

export interface usersServiceInterface{
    register(username: string, password:string) : Promise<object>,
    login(username: string, password:string) : Promise<object>,
    logout(username: string): Promise<object>
}

export interface categoryServiceInterface {
    addCategory(categoryName : string, add_by: string)  : Promise<object>,
    deleteCategory(categoryID : string) : Promise<object>,
    getAllCategories(page:any) : Promise<object>,
    updateCategory(categoryID : string, newCategoryName: string, updated_by: string) : Promise<object>
}

export interface authorServiceInterface{
    addAuthor(name : string, biography: string, nationality: string, add_by: string): Promise<object>,
    getAllAuthors(page: number): Promise<object>,
    updateAuthor(authorID: string, updatedName: string, updatedBiography: string, updatedNationality : string, updated_by: string): Promise<object>,
    deleteAuthor(authorID : string) : Promise<object>,
    getAuthor(authorID: string) : Promise<object>
}