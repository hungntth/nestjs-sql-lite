import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UploadService } from './upload.service';
import { UploadDto } from './dto/upload.dto';
import { UploadResponseDto } from './dto/upload-response.dto';
import { I18nService } from 'nestjs-i18n';

@ApiTags('upload')
@ApiBearerAuth()
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Upload an image file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: UploadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: UploadResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<UploadResponseDto> {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      const errorMessage = await this.i18n.translate('UPLOAD.INVALID_TYPE', {
        lang: request.headers['accept-language'] || 'vi',
      });

      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      throw new BadRequestException(errorMessage);
    }

    return this.uploadService.create(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all uploads' })
  @ApiResponse({
    status: 200,
    description: 'List of all uploads',
    type: [UploadResponseDto],
  })
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload by id' })
  @ApiResponse({
    status: 200,
    description: 'Upload details',
    type: UploadResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.uploadService.findOne(id);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete upload' })
  @ApiResponse({ status: 200, description: 'Upload deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.uploadService.remove(id);
  }
}
