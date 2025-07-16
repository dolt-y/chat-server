import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class FileUploadController {
  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      storage: diskStorage({
        destination: './uploads/single',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          cb(
            null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 限制文件大小为 5MB
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File not uploaded'); // 处理未上传文件的情况
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { originalname, filename } = file; // 使用解构赋值
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      originalname,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filename,
    };
  }
}
