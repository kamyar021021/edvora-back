import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Student } from "../../students/entities/student.entity";

export type PaymentMethod = "cash" | "card" | "transfer" | "other";

@Entity("payments")
@Index(["userId"])
@Index(["studentId"])
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "uuid" })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: "CASCADE" })
  @JoinColumn({ name: "studentId" })
  student: Student;

  @Column({ type: "bigint" })
  amount: number;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "varchar", length: 20 })
  method: PaymentMethod;

  @Column({ type: "text", nullable: true })
  note: string | null;

  @CreateDateColumn()
  createdAt: Date;
}