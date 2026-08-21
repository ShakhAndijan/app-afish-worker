import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Avatar from './Avatar';

export default function ReviewDetailSheet({
  visible,
  review,
  work,
  client,
  onClose,
  onOpenClient,
  onOpenWork,
  t,
}) {
  if (!review) return null;

  const workPhoto = work?.afterPhotos?.[0] || work?.beforePhotos?.[0];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.overlay} />
      </TouchableWithoutFeedback>

      <View style={s.sheetWrap} pointerEvents="box-none">
        <View
          style={[
            s.sheet,
            { backgroundColor: t.card, borderColor: t.border },
          ]}
        >
          <View style={s.grabberRow}>
            <View style={[s.grabber, { backgroundColor: t.border }]} />
          </View>

          <View style={s.headerRow}>
            <Text style={{ fontWeight: '700', fontSize: 17, color: t.text }}>
              Sharh tafsilotlari
            </Text>
            <TouchableOpacity
              style={[s.closeBtn, { backgroundColor: t.rowIconBg }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="close" size={17} color={t.muted} />
            </TouchableOpacity>
          </View>

          <View style={s.body}>
            {/* Reviewer — bosilsa mijoz profiliga o'tadi */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              activeOpacity={client ? 0.7 : 1}
              disabled={!client}
              onPress={() => onOpenClient?.(client)}
            >
              <Avatar letter={review.name.charAt(0)} bgColor={t.blue} size={48} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>
                  {review.name}
                </Text>
                <Text style={{ fontSize: 11.5, color: client ? t.orange : t.muted, marginTop: 2, fontWeight: client ? '700' : '400' }}>
                  {client ? "Mijoz profilini ko'rish" : review.time}
                </Text>
              </View>
              {client && (
                <View style={[s.chevronBtn, { backgroundColor: t.rowIconBg }]}>
                  <Ionicons name="chevron-forward" size={16} color={t.faint} />
                </View>
              )}
            </TouchableOpacity>

            {/* Rating */}
            <View style={[s.ratingRow, { backgroundColor: t.rowIconBg }]}>
              <View style={{ flexDirection: 'row', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={18}
                    color={i < review.rating ? t.gold : t.border}
                  />
                ))}
              </View>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: t.text }}>
                {review.rating.toFixed(1)}
              </Text>
            </View>

            {/* Quoted text */}
            <View
              style={[
                s.quoteBox,
                { backgroundColor: t.rowIconBg, borderColor: t.border },
              ]}
            >
              <MaterialCommunityIcons
                name="format-quote-open"
                size={20}
                color={t.orange}
                style={{ marginBottom: 2 }}
              />
              <Text style={{ fontSize: 14, color: t.text, lineHeight: 21 }}>
                {review.text}
              </Text>
            </View>

            {/* Bajarilgan ish — sharh shu ish uchun qoldirilgan */}
            {work && (
              <>
                <Text style={[s.sectionLabel, { color: t.faint }]}>
                  BAJARILGAN ISH
                </Text>
                <TouchableOpacity
                  style={[s.workCard, { backgroundColor: t.rowIconBg, borderColor: t.border }]}
                  activeOpacity={0.85}
                  onPress={() => onOpenWork?.(work)}
                >
                  {workPhoto && (
                    <View
                      style={[
                        s.workPhoto,
                        { backgroundColor: (work.color || t.orange) + '18', borderColor: (work.color || t.orange) + '35' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={workPhoto.icon}
                        size={40}
                        color={work.color || t.orange}
                      />
                      <Text style={[s.workPhotoLabel, { color: work.color || t.orange }]} numberOfLines={1}>
                        {workPhoto.label}
                      </Text>
                    </View>
                  )}
                  <View style={s.workInfoRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }} numberOfLines={1}>
                        {work.title}
                      </Text>
                      <Text style={{ fontSize: 11.5, color: t.muted, marginTop: 2 }} numberOfLines={1}>
                        {work.category} · {work.price} so'm
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={t.faint} />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,8,14,0.65)',
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -16 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 24,
    paddingBottom: 24,
    maxHeight: '88%',
  },
  grabberRow: { paddingTop: 12, alignItems: 'center' },
  grabber: { width: 42, height: 5, borderRadius: 3 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: { paddingHorizontal: 20, paddingTop: 16, gap: 14 },

  chevronBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  quoteBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 15,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 2,
    marginBottom: -4,
  },

  workCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  workPhoto: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderBottomWidth: 1,
  },
  workPhotoLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  workInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
});
