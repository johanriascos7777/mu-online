// src/components/02-molecules/POOModal/index.tsx
//
// Molécula SEMI-SMART — modal educativo de POO
//
// Muestra: concepto POO + diagrama + código real + qué pasa en el back
//
// Props:
//   concepts   → lista de ConceptId para mostrar (con paginación)
//   visible    → controla si el modal está abierto
//   onClose    → cierra el modal
//   title      → título contextual ("Al crear un personaje...")
//
// Paginación interna:
//   Si concepts tiene varios items, el usuario puede navegar entre ellos
//   con "← Anterior" / "Siguiente →"

import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import type { ConceptId } from '../../../data/poo-concepts';
import { POO_CONCEPTS } from '../../../data/poo-concepts';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export interface POOModalProps {
  /** Qué conceptos mostrar — puede ser 1 o varios */
  concepts:  ConceptId[];
  visible:   boolean;
  onClose:   () => void;
  /** Título contextual: "Al presionar Attack..." */
  title?:    string;
}

export function POOModal({
  concepts,
  visible,
  onClose,
  title,
}: POOModalProps) {

  const [page, setPage] = useState(0);

  const concept  = POO_CONCEPTS[concepts[page]];
  const hasPages = concepts.length > 1;
  const isFirst  = page === 0;
  const isLast   = page === concepts.length - 1;

  if (!concept) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* ── Overlay oscuro ── */}
      <TouchableOpacity
        style={{
          flex:            1,
          backgroundColor: 'rgba(0,0,0,0.82)',
          justifyContent:  'center',
          alignItems:      'center',
          padding:         16,
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* ── Panel del modal — TouchableOpacity dentro para no cerrar al tocar ── */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            width:           Math.min(SCREEN_W - 32, 480),
            maxHeight:       SCREEN_H * 0.88,
            backgroundColor: '#0a0a12',
            borderWidth:     1,
            borderColor:     `${concept.accentColor}55`,
            position:        'relative',
          }}
        >
          {/* Borde top con color del concepto */}
          <View style={{
            height:          3,
            backgroundColor: concept.accentColor,
          }} />

          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Header ── */}
            <View style={{
              flexDirection:  'row',
              justifyContent: 'space-between',
              alignItems:     'flex-start',
              marginBottom:   16,
            }}>
              <View style={{ flex: 1 }}>
                {/* Título contextual (opcional) */}
                {title && (
                  <Text style={{
                    fontFamily:    'Cinzel_400Regular',
                    fontSize:      8,
                    letterSpacing: 3,
                    color:         '#4a5568',
                    marginBottom:  6,
                    textTransform: 'uppercase',
                  }}>
                    {title}
                  </Text>
                )}

                {/* Emoji + Concepto */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 26 }}>{concept.emoji}</Text>
                  <View>
                    <Text style={{
                      fontFamily:    'Cinzel_700Bold',
                      fontSize:      20,
                      color:         '#e8dfc0',
                      letterSpacing: 2,
                    }}>
                      {concept.title}
                    </Text>
                    <Text style={{
                      fontFamily:    'Cinzel_400Regular',
                      fontSize:      10,
                      color:         concept.accentColor,
                      letterSpacing: 2,
                    }}>
                      {concept.subtitle}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Botón cerrar */}
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width:           28,
                  height:          28,
                  alignItems:      'center',
                  justifyContent:  'center',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth:     1,
                  borderColor:     'rgba(255,255,255,0.08)',
                }}
              >
                <Text style={{ color: '#718096', fontSize: 14 }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ── Tagline ── */}
            <View style={{
              backgroundColor: `${concept.accentColor}18`,
              borderLeftWidth:  3,
              borderLeftColor:  concept.accentColor,
              paddingVertical:  8,
              paddingHorizontal: 12,
              marginBottom:     16,
            }}>
              <Text style={{
                fontFamily: 'Cinzel_400Regular',
                fontSize:   13,
                color:      '#e8dfc0',
                lineHeight: 22,
                fontStyle:  'italic',
              }}>
                "{concept.tagline}"
              </Text>
            </View>

            {/* ── Explicación ── */}
            <Text style={{
              fontFamily: 'Cinzel_400Regular',
              fontSize:   12,
              color:      '#8a9bb0',
              lineHeight: 22,
              marginBottom: 16,
            }}>
              {concept.explanation}
            </Text>

            {/* ── Diagrama ── */}
            <SectionTitle title="📐 Diagrama" color={concept.accentColor} />
            <View style={{
              backgroundColor: '#06060e',
              borderWidth:     1,
              borderColor:     'rgba(255,255,255,0.06)',
              padding:         12,
              marginBottom:    16,
            }}>
              <Text style={{
                fontFamily: 'Courier New',
                fontSize:   11,
                color:      '#70c878',
                lineHeight: 20,
              }}>
                {concept.diagram}
              </Text>
            </View>

            {/* ── Código real del proyecto ── */}
            <SectionTitle title={`💻 ${concept.codeTitle}`} color={concept.accentColor} />
            <View style={{
              backgroundColor: '#06060e',
              borderWidth:     1,
              borderColor:     `${concept.accentColor}30`,
              padding:         12,
              marginBottom:    16,
            }}>
              <Text style={{
                fontFamily: 'Courier New',
                fontSize:   10,
                color:      '#c8d8e8',
                lineHeight: 18,
              }}>
                {concept.code}
              </Text>
            </View>

            {/* ── Qué pasa en el backend ── */}
            <SectionTitle title="⚙️ Qué pasa en el backend" color={concept.accentColor} />
            <View style={{
              backgroundColor: 'rgba(201,168,76,0.06)',
              borderWidth:     1,
              borderColor:     'rgba(201,168,76,0.15)',
              padding:         12,
              marginBottom:    concept.nestjsTip ? 16 : 0,
            }}>
              <Text style={{
                fontFamily: 'Cinzel_400Regular',
                fontSize:   11,
                color:      '#a09060',
                lineHeight: 20,
              }}>
                {concept.backendAction}
              </Text>
            </View>

            {/* ── NestJS Tip (opcional) ── */}
            {concept.nestjsTip && (
              <>
                <SectionTitle title="🔧 En NestJS" color={concept.accentColor} />
                <View style={{
                  backgroundColor: 'rgba(230,126,34,0.08)',
                  borderWidth:     1,
                  borderColor:     'rgba(230,126,34,0.2)',
                  padding:         12,
                }}>
                  <Text style={{
                    fontFamily: 'Cinzel_400Regular',
                    fontSize:   11,
                    color:      '#c87830',
                    lineHeight: 20,
                  }}>
                    {concept.nestjsTip}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>

          {/* ── Navegación de páginas ── */}
          {hasPages && (
            <View style={{
              flexDirection:    'row',
              justifyContent:   'space-between',
              alignItems:       'center',
              padding:          14,
              borderTopWidth:   1,
              borderTopColor:   'rgba(255,255,255,0.06)',
              backgroundColor:  '#08080f',
            }}>
              <TouchableOpacity
                onPress={() => setPage(p => Math.max(0, p - 1))}
                disabled={isFirst}
                style={{ opacity: isFirst ? 0.3 : 1 }}
              >
                <Text style={{
                  fontFamily:    'Cinzel_400Regular',
                  fontSize:      9,
                  letterSpacing: 2,
                  color:         concept.accentColor,
                }}>
                  ← ANTERIOR
                </Text>
              </TouchableOpacity>

              {/* Dots */}
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {concepts.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setPage(i)}
                    style={{
                      width:           6,
                      height:          6,
                      borderRadius:    3,
                      backgroundColor: i === page
                        ? concept.accentColor
                        : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setPage(p => Math.min(concepts.length - 1, p + 1))}
                disabled={isLast}
                style={{ opacity: isLast ? 0.3 : 1 }}
              >
                <Text style={{
                  fontFamily:    'Cinzel_400Regular',
                  fontSize:      9,
                  letterSpacing: 2,
                  color:         concept.accentColor,
                }}>
                  SIGUIENTE →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Esquinas decorativas ── */}
          <View style={{ position:'absolute', top:3, left:0, width:12, height:12, borderTopWidth:1, borderLeftWidth:1, borderColor:`${concept.accentColor}60` }} />
          <View style={{ position:'absolute', bottom:0, right:0, width:12, height:12, borderBottomWidth:1, borderRightWidth:1, borderColor:`${concept.accentColor}60` }} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Sub-componente: título de sección ─────────────────────────
function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <View style={{
      flexDirection:  'row',
      alignItems:     'center',
      gap:            8,
      marginBottom:   8,
    }}>
      <Text style={{
        fontFamily:    'Cinzel_400Regular',
        fontSize:      8,
        letterSpacing: 3,
        color,
        textTransform: 'uppercase',
      }}>
        {title}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: `${color}25` }} />
    </View>
  );
}