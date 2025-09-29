const express = require("express");
const router = express.Router();
const { admin, db } = require("../services/firebase.js");
const { validationResult } = require("express-validator");

const CommandeController = {
    // Créer une commande
    async createCommande(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erreurs: errors.array() });
        }

        try {
            const {
                id_restaurant,
                id_gestionnaire,
                qte_commande,
                date_commande,
            } = req.body;

            // Vérification des champs obligatoires
            if (!id_restaurant || !id_gestionnaire || !qte_commande) {
                return res.status(400).json({
                    error: "Les champs 'id_restaurant', 'id_gestionnaire' et 'qte_commande' sont obligatoires.",
                });
            }

            // Récupération automatique de l'utilisateur connecté
            const id_personne = req.user.uid;

            // Création d'une commande
            const docRef = await db.collection("commandes").add({
                id_personne,
                id_restaurant,
                id_gestionnaire,
                qte_commande,
                date_commande: date_commande ? new Date(date_commande) : new Date(),
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            res.status(201).json({
                message: "Commande créée avec succès",
                id_commande: docRef.id,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer toutes les commandes
    async getCommandes(req, res) {
        try {
            const snapshot = await db
                .collection("commandes")
                .orderBy("date_commande", "desc")
                .get();

            const commandes = snapshot.docs.map((doc) => ({
                id_commande: doc.id,
                ...doc.data(),
            }));

            res.status(200).json(commandes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer une commande par ID
    async getCommandeById(req, res) {
        try {
            const docRef = db.collection("commandes").doc(req.params.id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).json({ error: "Commande non trouvée." });
            }

            res.status(200).json({ id_commande: doc.id, ...doc.data() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour une commande
    async updateCommande(req, res) {
        try {
            const docRef = db.collection("commandes").doc(req.params.id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).json({ error: "Commande non trouvée." });
            }

            const updateData = { ...req.body };
            updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

            await docRef.update(updateData);

            res.status(200).json({ message: "Commande mise à jour avec succès." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Supprimer une commande
    async deleteCommande(req, res) {
        try {
            const docRef = db.collection("commandes").doc(req.params.id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).json({ error: "Commande non trouvée." });
            }

            await docRef.delete();
            res.status(200).json({ message: "Commande supprimée avec succès." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = CommandeController;
