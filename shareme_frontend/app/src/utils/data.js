export const userQeury = (userId) => {
    const query = `*[_type == "user" && _id == '${userId}']`;

    return query;
};
