import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiResponseWithDescriptions() {
  return applyDecorators(
    ApiResponse({ status: 200, description: '请求成功' }),
    ApiResponse({ status: 201, description: '创建成功' }),
    ApiResponse({ status: 400, description: '无效输入' }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 404, description: '未找到' }),
    ApiResponse({ status: 500, description: '服务器内部错误' }),
  );
}
