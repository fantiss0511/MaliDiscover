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
            const {
                id_restaurant,
                id_hotel,
                id_evenement,
                id_activite,
                date_reservation,
                nbre_personne,
            } = req.body;

            // Vérification des champs requis (au moins date et nombre de personnes)
            if (!date_reservation || !nbre_personne) {
                return res.status(400).json({
                    error: "Les champs 'date_reservation' et 'nbre_personne' sont obligatoires.",
                });
            }

            // Récupération de l'UID automatiquement via authFirebase
            const utilisateurId = req.user.uid;

            const docRef = await db.collection("reservations").add({
                id_personne: utilisateurId, // Correction: utiliser l'UID Firebase
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

    // Récupérer automatiquement les infos de l'utilisateur connecté
    async getUserInfo(req, res) {
        try {
            // ⚡ Grâce à authFirebase, req.user contient déjà les infos Firebase
            const user = req.user;

            // Récupérer plus de détails dans Firestore si tu stockes un profil utilisateur
            const userDoc = await db.collection("users").doc(user.uid).get();
            let userProfile = {};

            if (userDoc.exists) {
                userProfile = userDoc.data();
            }

            res.status(200).json({
                uid: user.uid,
                email: user.email,
                name: user.name || userProfile.name || "",
                phone: user.phone || userProfile.phone || "",
                ...userProfile, // merge avec le profil Firestore si besoin
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
