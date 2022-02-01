import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { apiPropertyExample } from 'src/common/constants';
import { Board } from 'src/resources/boards/entities/board.entity';
import { User } from 'src/resources/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column as TableColumn,
  ManyToOne,
} from 'typeorm';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Entity({ name: 'tasks' })
export class Task {
  @ApiProperty({ example: apiPropertyExample.id })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: apiPropertyExample.title })
  @TableColumn()
  title: string;

  @ApiProperty({ example: apiPropertyExample.order })
  @TableColumn()
  order: number;

  @ApiProperty({ example: apiPropertyExample.description })
  @TableColumn()
  description: string;

  @ApiProperty({ example: apiPropertyExample.id })
  @TableColumn({ nullable: true })
  userId: string;

  @ApiProperty({ example: apiPropertyExample.id })
  @TableColumn({ nullable: true })
  boardId: string;

  @ApiProperty({ example: apiPropertyExample.id })
  @TableColumn({ nullable: true })
  columnId: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.task, { onDelete: 'SET NULL' })
  user: User;

  @ApiHideProperty()
  @ManyToOne(() => Board, (board) => board.task, { onDelete: 'CASCADE' })
  board: Board;

  /**
   * Get from user id, title, order, description,userId
   *
   * @param  task - task to destruct
   * @returns id string, title string, order number|null, description string, userId string
   */
  static toResponse(task: Task | UpdateTaskDto) {
    const { id, title, order, description, userId } = task;
    return { id, title, order, description, userId };
  }
}
