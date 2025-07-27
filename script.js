import { db, doc, setDoc, updateDoc, onSnapshot, deleteDoc, collection, getDocs } from './firebase-config.js';

// DOM Elements
const addForm = document.getElementById("addForm");
const sellForm = document.getElementById("sellForm");
const inventoryTable = document.querySelector("#inventoryTable tbody");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const totalMedicinesSpan = document.getElementById("totalMedicines");
const expiringSoonSpan = document.getElementById("expiringSoon");
const inventoryValueSpan = document.getElementById("inventoryValue");
document.getElementById('splashScreen').style.display = 'none'; // Hide after load

// ✅ Add Medicine
addForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const medicine = {
    name: addForm.productName.value.trim(),
    brand: addForm.brandName.value.trim(),
    qty: parseInt(addForm.quantity.value),
    price: parseFloat(addForm.price.value),
    expiry: addForm.expiryDate.value,
    batch: addForm.batchNumber.value.trim(),
    lastUpdated: new Date().toISOString()
  };

  if (!medicine.name || isNaN(medicine.qty) || medicine.qty <= 0) {
    return alert("Please enter valid medicine details!");
  }

  try {
    await setDoc(doc(db, "inventory", medicine.name), medicine);
    addForm.reset();
  } catch (error) {
    alert("Error adding medicine: " + error.message);
  }
});

// ✅ Sell Medicine
// ✅ Sell Medicine (Corrected Version)
sellForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = sellForm.sellName.value.trim();
  const sellQty = parseInt(sellForm.sellQty.value);

  if (!name || isNaN(sellQty) || sellQty <= 0) {
    return alert("कृपया सही quantity डालें!");
  }

  try {
    const medRef = doc(db, "inventory", name);
    const medSnap = await getDoc(medRef); // अब यह काम करेगा

    if (!medSnap.exists()) {
      alert("दवाई नहीं मिली! नाम चेक करें");
    } else if (medSnap.data().qty < sellQty) {
      alert(`सिर्फ ${medSnap.data().qty} units available हैं!`);
    } else {
      await updateDoc(medRef, {
        qty: medSnap.data().qty - sellQty,
        lastUpdated: new Date().toISOString()
      });
      sellForm.reset();
      alert(`${sellQty} ${name} बेच दिए गए!`);
    }
  } catch (error) {
    alert("Sale failed: " + error.message);
  }
});

// ✅ Real-time Inventory Updates
onSnapshot(collection(db, "inventory"), (snapshot) => {
  let totalItems = 0;
  let expiringCount = 0;
  let totalValue = 0;
  const today = new Date();
  
  inventoryTable.innerHTML = "";
  
  snapshot.forEach(doc => {
    const med = doc.data();
    totalItems++;
    totalValue += med.qty * med.price;
    
    // Expiry check
   // Inside onSnapshot() after expiringCount++
if (med.expiry && new Date(med.expiry) < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
  expiringCount++;
  // Add to expiring list
  const expiringList = document.getElementById("expiringList");
  if (expiringList) {
    const item = document.createElement("div");
    item.textContent = `${med.name} (Expires: ${med.expiry})`;
    expiringList.appendChild(item);
  }
}


    
    // Create table row
    const row = document.createElement("tr");
    if (med.expiry && new Date(med.expiry) < today) {
      row.classList.add("expired");
    }
    row.innerHTML = `
      <td>${med.name}</td>
      <td>${med.brand}</td>
      <td class="${med.qty < 10 ? 'low-stock' : ''}">${med.qty}</td>
      <td>₹${med.price.toFixed(2)}</td>
      <td>${med.expiry || 'N/A'}</td>
      <td>${med.batch || 'N/A'}</td>
    `;
    inventoryTable.appendChild(row);
  });
  
  // Update dashboard
  totalMedicinesSpan.textContent = totalItems;
  expiringSoonSpan.textContent = expiringCount;
  inventoryValueSpan.textContent = `₹${totalValue.toFixed(2)}`;
  document.getElementById('lastSync').textContent = new Date().toLocaleString();
});

// ✅ Search Functionality
searchInput?.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = inventoryTable.querySelectorAll("tr");
  
  rows.forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();
    const brand = row.cells[1].textContent.toLowerCase();
    row.style.display = name.includes(searchTerm) || brand.includes(searchTerm) ? "" : "none";
  });
});

// ✅ Clear Inventory
clearBtn?.addEventListener("click", async () => {
  if (confirm("⚠️ Delete ALL inventory items? This cannot be undone!")) {
    try {
      const snapshot = await getDocs(collection(db, "inventory"));
      const deletePromises = [];
      snapshot.forEach(doc => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      await Promise.all(deletePromises);
    } catch (error) {
      alert("Error clearing inventory: " + error.message);
    }
  }
});