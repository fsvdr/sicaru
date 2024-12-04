import db from '@db/index';
import { users } from '@db/schema';
import { SignUpInput } from '../../app/(admin)/app/(auth)/signin/page';

const UserDAO = {
  async getUserByEmail(email: string) {
    const response = await db.query.users.findFirst({
      where(fields, operators) {
        return operators.eq(fields.email, email);
      },
    });

    return response;
  },
  async insertUser(data: SignUpInput) {
    const response = await db.insert(users).values({});
  },
};

export default UserDAO;
