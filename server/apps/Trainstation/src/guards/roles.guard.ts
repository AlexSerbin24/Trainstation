import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  private roleIdToRoleMap = {
    1: 'admin',
    2: 'user',
  };

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    console.log('Required roles:', requiredRoles);
    const { user } = context.switchToHttp().getRequest();
    console.log('User:', user);

    const userRole = this.roleIdToRoleMap[user.roleId];
    console.log('User role:', userRole);

    return requiredRoles.includes(userRole);
  }
}
