import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { apiPropertyExample } from 'src/common/constants';
import { Board } from 'src/resources/boards/entities/board.entity';
import { Task } from 'src/resources/tasks/entities/task.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column as TableColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'columns' })
export class Column {
  @ApiProperty({ example: apiPropertyExample.id })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: apiPropertyExample.title })
  @IsString()
  @TableColumn()
  title: string;

  @ApiProperty({ example: apiPropertyExample.order })
  @IsNumber()
  @TableColumn()
  order: number;

  @ApiProperty({ example: apiPropertyExample.id })
  @TableColumn()
  boardId: string;

  @ApiHideProperty()
  @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' })
  board: Board;

  @ApiHideProperty()
  @OneToMany(() => Task, (task) => task.column)
  task: Task;
}
