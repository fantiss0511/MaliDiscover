const express = require("express");
const router = express.Router();
const { admin, db } = require("../services/firebase.js");
const { validationResult } = require("express-validator");

const ReservationController = {
    // Créer une réservation
    async createReservation(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erreurs: errors.array() });
        }

        try {
            // Vérification de l’authentification
            if (!req.user) {
                return res.status(401).json({ error: "Utilisateur non connecter." });
            }

            const utilisateurId = req.user.uid;

            // Vérification du rôle de l’utilisateur
            const userDoc = await db.collection("Personne").doc(utilisateurId).get();
            if (!userDoc.exists) {
                return res.status(403).json({ error: "Compte utilisateur introuvable." });
            }

            const userData = userDoc.data();
            if (userData.role !== "user") {
                return res.status(403).json({ error: "Seuls les utilisateurs avec le rôle 'user' peuvent effectuer une réservation." });
            }

            const {
                id_restaurant,
                id_hotel,
                id_evenement,
                id_activite,
                date_reservation,
                nbre_personne,
            } = req.body;

            // Vérification des champs requis
            if (!date_reservation || !nbre_personne) {
                return res.status(400).json({
                    error: "Les champs 'date_reservation' et 'nbre_personne' sont obligatoires.",
                });
            }

            const docRef = await db.collection("reservations").add({
                id_personne: utilisateurId,
                id_restaurant: id_restaurant || null,
                id_hotel: id_hotel || null,
                id_evenement: id_evenement || null,
                id_activite: id_activite || null,
                date_reservation: new Date(date_reservation),
                nbre_personne: nbre_personne || null,
                statut: "en attente",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            res.status(201).json({
                message: "Réservation créée avec succès",
                id: docRef.id,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer toutes les réservations
    async getReservations(req, res) {
        try {
            const snapshot = await db
                .collection("reservations")
                .orderBy("date_reservation", "desc")
                .get();

            const reservations = snapshot.docs.map((doc) => ({
                id_reservation: doc.id,
                ...doc.data(),
            }));

            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour une réservation
    async updateReservation(req, res) {
        try {
            const docRef = db.collection("reservations").doc(req.params.id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).json({ error: "Réservation non trouvée." });
            }

            const updateData = { ...req.body };
            updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

            await docRef.update(updateData);

            res.status(200).json({ message: "Réservation mise à jour avec succès." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Supprimer une réservation
    async deleteReservation(req, res) {
        try {
            const docRef = db.collection("reservations").doc(req.params.id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).json({ error: "Réservation non trouvée." });
            }

            await docRef.delete();

            res.status(200).json({ message: "Réservation supprimée avec succès." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = ReservationController;
