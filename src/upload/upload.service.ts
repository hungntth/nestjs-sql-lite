import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../common/services/logger.service';
import * as fs from 'fs';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
    private logger: LoggerService,
  ) {}

  async create(file: Express.Multer.File) {
    const upload = this.uploadRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    });

    await this.uploadRepository.save(upload);
    this.logger.log(`File uploaded: ${upload.filename}`);
    return upload;
  }

  async findAll() {
    return this.uploadRepository.find();
  }

  async findOne(id: number) {
    const upload = await this.uploadRepository.findOne({ where: { id } });
    if (!upload) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }
    return upload;
  }

  async remove(id: number) {
    const upload = await this.findOne(id);
    
    // Delete file from filesystem
    try {
      fs.unlinkSync(upload.path);
    } catch (error) {
      this.logger.error(`Error deleting file: ${upload.filename}`, error.stack);
    }

    await this.uploadRepository.remove(upload);
    this.logger.log(`Upload deleted: ${id}`);
  }
}