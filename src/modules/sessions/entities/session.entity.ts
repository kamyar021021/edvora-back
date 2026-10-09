import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Student } from "../../students/entities/student.entity";

export type SessionStatus = "scheduled" | "completed" | "canceled";

@Entity("sessions")
@Index(["userId"])
@Index(["studentId"])
export class Session {
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

  @Column({ type: "date" })
  date: string;

  @Column({ type: "int" })
  duration: number;

  @Column({ type: "varchar", length: 20 })
  status: SessionStatus;

  @Column({ type: "text", nullable: true })
  note: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}