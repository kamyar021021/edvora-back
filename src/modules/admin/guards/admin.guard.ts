import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User | undefined;

    if (!user) {
      throw new UnauthorizedException("ابتدا وارد شوید");
    }

    if (!user.isAdmin) {
      throw new ForbiddenException("دسترسی فقط برای مدیران");
    }

    return true;
  }
}