import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { typeDefs } from './schema.js'
import db from './_db.js'

const resolvers = {
	Query: {
		games: () => db.games,
		reviews: () => db.reviews,
		authors: () => db.authors,
		review(_, args) {
			return db.reviews.find(review => review.id === args.id)
		},
		game(_, args) {
			return db.games.find(game => game.id === args.id)
		},
		author(_, args) {
			return db.authors.find(author => author.id === args.id)
		},
	},
	Game: {
		reviews(parent) {
			return db.reviews.filter(review => review.game_id === parent.id)
		}
	},
	Mutation: {
		addGame(_, args) {
			const newGame = {
				...args.game,
				id: String(db.games.length + 1),
			}
			db.games.push(newGame)
			return newGame
		},
		addReview(_, args) {
			const newReview = {
				id: String(db.reviews.length + 1),
				rating: args.rating,
				content: args.content,
				author_id: args.author_id,
				game_id: args.game_id,
			}
			db.reviews.push(newReview)
			return newReview
		},
		addAuthor(_, args) {
			const newAuthor = {
				id: String(db.authors.length + 1),
				name: args.name,
				verified: args.verified,
			}
			db.authors.push(newAuthor)
			return newAuthor
		},
		deleteGame(_, args) {
			const game = db.games.find(game => game.id === args.id)
			db.games = db.games.filter(game => game.id !== args.id)
			return game
		}
	}
}

// server setup
const server = new ApolloServer({
	typeDefs,
	resolvers,

})

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 }
})

console.log('Server ready at port:', 4000)
