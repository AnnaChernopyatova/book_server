import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    @JoinTable()
    @OneToMany(() => Book, book => book.author_id)
    id!: number;
    @Column({
        length: 100
    })
    name!: string;
}

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({
        length: 70
    })
    name!: string;
    @ManyToOne(() => Author, author => author.id)
    @JoinColumn()
    author_id!: number;
}