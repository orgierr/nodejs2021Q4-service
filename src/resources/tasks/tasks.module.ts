import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { BoardsModule } from '../boards/boards.module';
import { Board } from '../boards/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Board]), BoardsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
