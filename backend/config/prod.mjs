const mongoDBPass = process.env.mongoDBPass;
export default {
	dbURL: `mongodb+srv://sunday:${mongoDBPass}@cluster0.jrsd21j.mongodb.net/?retryWrites=true&w=majority`,
	dbName: 'sunday',
};
