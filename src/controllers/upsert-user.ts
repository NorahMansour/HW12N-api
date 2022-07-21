export function upsertUserController(users: any[], newUser: any) {
	const userIndex = users.findIndex((el) => el.id === newUser.id);
	if (userIndex === -1) {
		users.push(newUser);
	} else {
		users[userIndex] = {
			...users[userIndex],
			...newUser,
		};
	}
	return users;
}